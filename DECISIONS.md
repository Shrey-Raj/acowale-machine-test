**DECISIONS.md**  
*(or a section in your README – write it as part of the submission)*

---

### 1. Why did you choose this technology stack?

**Next.js (App Router)** – I wanted a full‑stack framework with server‑side rendering and API routes in one place. It makes building the public form and the admin dashboard super smooth, and the App Router gives us better control over layouts and data fetching.  
**TypeScript** – helps catch bugs early, and I love the autocomplete.  
**Tailwind CSS + shadcn UI** – I wanted to build a clean, consistent UI quickly without writing custom CSS. shadcn gives us unstyled, accessible components that I can tweak as needed.  
**React Context API** – for global state like user session and feedback filters. I didn’t need a heavy state manager like Redux for this scale.  
**MongoDB** – (see next point).  
**NextAuth.js** – because it’s the simplest way to add Google OAuth with Next.js, and it handles sessions and JWT out of the box.

---

### 2. Why did you choose this database?

I went with **MongoDB** because the feedback data is naturally document‑structured – each feedback has a category, comments, optional email, and timestamps. No complex joins needed. Also, MongoDB Atlas is easy to set up and scales well. The flexible schema allows us to add fields later (like status or user reference) without migrations. And the aggregation framework made it a breeze to generate the analytics summary (monthly counts, category distribution, distinct users). Also, it features a fully Automated Indexing system via its Performance Advisor that is better for a large application(in future, maybe).

---

### 3. Why did you structure your application this way?

I followed a **feature‑based** organisation inside the `app` folder – each major page (`dashboard`, `login`, `api/feedback`, etc.) lives in its own directory. That makes it easy to find and modify related code.  
- **API routes** are grouped under `/api` – clear separation between public endpoints (`/api/feedback`) and admin‑protected ones (`/api/admin/*`).  
- **Shared utilities** (`lib/`) – db connection, error handling, validation schemas – are reused across routes.  
- **Components** are reusable (`ui/` from shadcn, which are auto generated when we install them). And, *(components)* folder that contains the resuable function components for the core UI
- **Middleware/Proxy** sits at the same level as *app* to handle authentication redirects globally. This keeps route protection centralised and avoids duplication.
I also added a **global error handler** (`withErrorHandler`) to all API routes – so every endpoint returns consistent JSON errors, and client‑side I show toasts.

---

### 4. What trade‑offs did you make due to time constraints?

Given the 6‑10 hour window, I prioritised **core functionality** over polish:

- **No unit tests** – I would have written them, but I spent time on authentication and error handling instead.
- **Simplified authentication** – I used Google OAuth only, no email/password.
- **Client‑side state** – I used Context for the dashboard, but I didn’t fully implement caching or optimistic updates.

These were conscious decisions to deliver a working, deployable product within the time.
---

### 5. What would you improve if you had one more week?

1. **Add unit and integration tests** – for API routes and components.
2. **Add a “status” field** – to mark feedback as resolved/unresolved, and show unresolved count properly.
3. **Better caching** – use React Query or SWR for dashboard data, with revalidation.
4. **Improve analytics** – add more charts, filter by date range, export data.

---

### 6. What was the most difficult technical challenge you faced?

The biggest challenge was **getting authentication redirects to work correctly in the new Next.js proxy (formerly middleware)**. I initially used the old `middleware.ts` convention, but the logs showed it wasn’t executing. After reading the latest Next.js docs, I learned that `middleware` has been renamed to `proxy` and the export changed. I also faced issues with the session cookie not being sent for the root (`/`) path – I debugged by logging all cookies and found that the cookie was missing for `/`. I fixed it by explicitly setting the cookie path and ensuring `NEXTAUTH_SECRET` was consistent. That consumed a good chunk of time, but now I have a solid understanding of the new proxy system.

I had to write the logic for the aggregation queries to get the data in the desired structure from the database for the `/fetch-analysis-summary`, that was some time consuming handling the edge cases and resultants at each step. 

---

### 7. Which AI tools did you use?

I used **GitHub Copilot** and **ChatGPT (GPT‑4)** extensively. Copilot helped with repetitive code snippets (like writing Zod schemas and Mongoose models). ChatGPT was our go‑to for debugging, explaining the new proxy API, and suggesting best practices for the analytics aggregation.

---

### 8. Share one instance where AI helped you.

When I was stuck with the proxy (middleware) not redirecting authenticated users from `/`, ChatGPT suggested using `getToken` from `next-auth/jwt` directly and logging all cookies. That led us to discover that the session cookie wasn’t being sent for the root route – I then fixed it by adjusting the cookie settings in NextAuth config. Moreover, it helped me achieve the desired structure that I wanted as the response from the APIs by refining the aggregation queries.

---

### 9. Share one instance where you disagreed with AI and why.

AI initially suggested using `next-auth/middleware` with `withAuth` and the `authorized` callback, which I tried first. But I felt it was hard to debug – the logs weren’t showing, and redirects were inconsistent. I disagreed and instead wrote a custom `proxy` function using `getToken` – simpler, explicit, and gave us full control. As a matter of fact, it still failed then I had revert back to the official documentation of Next.js and read the docs to find about the new changes in the latest version

---

### 10. What would break first if this application suddenly had 100,000 users?

**The analytics aggregation** – the `fetch-analytics-summary` runs `$group` and `$addToSet` over the entire collection – that would become slow without proper indexes (we’d need to pre‑aggregate or use a time‑series approach).  
**The dashboard** – if many admins query at once, the API would struggle with the load, and the frontend would be slow to render.  
**MongoDB connection pool** – might get exhausted if I don’t configure connection limits properly. We’d need to implement connection pooling and possibly use a read replica for analytics queries.

---

### 11. What is one thing in this assignment that you would improve, change, or challenge?
Clarity over the type of mertrics to be shown in the dashboard, and the required search or sorting features in the feeback-list could be benificial.