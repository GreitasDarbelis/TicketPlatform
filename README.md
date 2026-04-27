# Ticket Platform - Technical Report

## 1. System Structure and Assigned Technologies
A **3-tier multi-layer architectural style** was chosen to implement the project. The system is divided into the following layers:
1. **Presentation Tier**: Designed as a Single Page Application (SPA) running in the browser workspace using **React.js** and Vite. It communicates with the server via REST APIs. The application is entirely stateless on the backend side, therefore satisfying sessionless state rules.
2. **Business Logic Tier**: Runs on the server side using **Java** and **Spring Boot**. This tier contains `@Service` components that perform decision-making, process logic transactions, and run pricing algorithms. AOP Interceptors are configured exclusively in this layer for business logging.
3. **Data Access Tier**: Implemented using **Spring Data JPA** (powered by Hibernate ORM) and a **PostgreSQL** relational database. This tier manages data abstraction by avoiding manual SQL queries (preventing SQL injections via internal Prepared Statements) and provides concurrent editing protection via JPA Optimistic Locking.

## 2. Implementation of Qualitative Requirements in Source Code

| Requirement | Technological Solution | Project Example (Class & Explanation) |
| :--- | :--- | :--- |
| **Concurrency** | State is not saved in any backend session. HTTP requests are completely "stateless". | `frontend/` React application – user works asynchronously without session locks over the REST boundaries. |
| **Security (SQL inject)** | Secure queries via JPA "Prepared Statements" are utilized automatically in data operations. | `backend/src/main/java/com/ticketplatform/backend/repository/EventRepository.java` (inherits JpaRepository for automatic query shielding). |
| **Data Access** | Short transactions bound to single HTTP request scopes are managed via ORM. No logic is stalled pending UI entry. | `backend/src/main/java/com/ticketplatform/backend/service/EventService.java` utilizes the `@Transactional` method boundaries. |
| **Data consistency (Locking)** | JPA `@Version` annotation enforces conflict rejection (throwing `ObjectOptimisticLockingFailureException`). | `backend/src/main/java/com/ticketplatform/backend/model/Event.java` relies on an integer `@Version` field tracking conflicts. |
| **Memory management** | `Singleton scope` is strictly upheld for business logic, reducing the RAM footprint by avoiding session scoping. | `backend/src/main/java/com/ticketplatform/backend/service/EventService.java` naturally binds to Spring's default singleton context. |
| **Interceptors** | Spring AOP (`@Aspect`, `@Before`) logs all Service method invocations remotely without invasively editing primary classes. | `backend/src/main/java/com/ticketplatform/backend/aspect/LoggingAspect.java` executes execution intercepts across the `com.ticketplatform.backend.service.*` package. |
| **Extensibility** | “Strategy” design pattern implemented for calculating ticket prices based on flexible roles or periods. | Interface: `backend/src/main/java/com/ticketplatform/backend/service/strategy/TicketPriceStrategy.java` and implementation `StandardTicketPriceStrategy.java` |

---

### How to run the project locally?

**Using Docker**

The only command needed to start the entire stack:

```bash
docker-compose up --build
```
- **Frontend** will be available at: `http://localhost:5173` (with hot-reloading enabled)
- **Backend API** will be available at: `http://localhost:8080`
- **Database** will be exposed on port `5433` (to avoid conflicts with local installations)

**Manual Setup (Manual docker-compose setup) (only if Docker does not work):**

**Starting the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Starting the Backend (& Database setup):**
Ensure that a local instance of PostgreSQL is running with an empty database named `ticketplatform` (`username: postgres, password: root`) on port 5432.
```bash
cd backend
./mvnw spring-boot:run
# or simply "mvn spring-boot:run"
```
The database entity structure/tables will be generated automatically upon the first application start via Hibernate (`ddl-auto=update`).

Core frontend scaffold:

- `src/app/page-registry.ts` is the single route catalog for pages and subpages.
- `src/app/AppShell.tsx` provides the shared app bar, role switcher, and page navigation.
- `src/components/AppBreadcrumbs.tsx` renders breadcrumbs automatically from the route catalog.
- `src/components/PageTemplate.tsx` is the shared page layout wrapper.
- `src/components/PagePlaceholder.tsx` is the default stub to replace with real page content.
- `src/features/session/RoleSessionContext.tsx` holds the temporary active role used before real auth exists.

How to add a new page:

1. Create the page component.
2. Register its route metadata in `src/app/page-registry.ts`.
3. Attach the component to that route entry when it is ready.

Once a page is registered, the navigation shell and breadcrumbs can use it consistently.

Example:

```ts
{
  id: 'customer-events',
  role: 'customer',
  path: '/customer/events',
  title: 'Event Catalog',
  navLabel: 'Events',
  description: '...',
  summary: '...',
  outcomes: ['...'],
  icon: EventRoundedIcon,
  component: CustomerEventsPage,
}
```
