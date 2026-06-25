## The Token Bucket Rate Limiter Technique to prevent API Abuse

If we need to use a third party service and want to be under the API rate limts in order to not get blacklisted for API Abuse, we should implement a **Distributed Token Bucket Rate Limiter** using Redis.

### What is Token Bucket?

Imagine a bucket that holds a maximum number of tokens (`capacity`). 
* Tokens are added to the bucket at a constant rate (`refill rate`) over time.
* Every incoming API request requires a token. If a token is available, it’s consumed, and the request passes through.
* If the bucket is empty, the request is dropped immediately with a `429 Too Many Requests` status code.

### Moving from Local to Distributed

A naive implementation tracks this bucket in application memory. However, in a distributed, auto-scaled environment with multiple server instances, local memory tracking falls apart. A client could bypass the limit by hitting different server nodes. 

To solve this, we store the bucket state in **Redis**, which is a highly efficient approach.

### Implementation

Instead of actively refilling buckets every second (which wastes CPU), we calculate the token count *on the fly* whenever a request arrives. We store two keys in Redis for each identifier (like an IP or API key): `last_updated_timestamp` and `current_tokens`.

When an API call hits our middleware, we execute a fast Redis Lua script to perform three steps atomically:

1. **Calculate Elapsed Time:** `delta = current_time - last_updated_timestamp`
2. **Calculate New Tokens:** `tokens = min(capacity, current_tokens + (delta * refill_rate))`
3. **Evaluate:** If `tokens >= 1`, decrement by 1, update Redis with the new timestamp/token count, and allow the request. Otherwise, reject it.

Using a Lua script ensures that this entire read-and-write sequence happens atomically on the Redis server, preventing race conditions from concurrent requests.

### Benefits 

* It isolates our core database and expensive downstream services from sudden spikes.
* Because Redis operates completely in-memory, the rate-limiting check adds negligible latency (under 2 milliseconds) to the API lifecycle.
