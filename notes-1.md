
Building an app with ASPNET Core & Angular from scratch





------------------------------------------------------------------------------------------------------------------





Section 1 : Introduction




---------------------------

In this course, we'll build a Web App using:
	- ASP.NET Core WEB API 		v2.1
	- Entity Framework Core 	v2.1 
	- Angular					v6
	- { Node - Git - Bootstrap (v4.1) - FontAwesome() - SQLite (for dev) }

Setting up our env:

1) .NET SDK & Runtime
We go to `https://www.microsoft.com/net` > `Get started` to install our .NET Core 2.1 SDK; this automatically installs the runtime.

Now in our terminal if we run:
`dotnet --version`, we should see the version we are on... In our case it is `2.1.403`

2) NodeJS & NPM
Instructor uses versions `8.11.2 & 6.1.0` respectively. We use `10.5.0` & `6.4.1`

3) VSCode: excellent support for C# & Typescript

4) Postman APp

5) DB Browser for SQLite






------------------------------------------------------------------------------------------------------------------





Section 2 : Building a Walking Skeleton




---------------------------


Walking Skeleton? Tiny implementation of system that performs a small end-to-end function, linking together 
 the main architectural parts!
 Specifically, we want to prove that our SPA can speak to our API which can speak to our DB & vice versa

Our app has multiple moving parts - we want all these components to be working & prove that they're working
 before building out functionality of our app.

DB - ORM - API - SPA - Client
The `Object Relational Mapper (ORM)` - allows the API to send queries to the DB; in our case it is Entity Framework.


---------------------------


Create your .NET project:

If we do `dotnet new -h` we can see some of the many different project types that we can create. 
In our application, we want to do the `ASP.NET Core Web API`.
We don't do `ASP.NET CORE With Angular` because we want to separate our ASP.NET code as the API and our Angular
 code as our Front End.
By keeping projects separate, we have greater control over which versions of ASP.NET & Angular we want to use
 and we aren't tied into the Microsoft template releases.
To get more information, we run `dotnet new webapi --help`
The project we envision required authentication... However, note from the -au option that all are eithe specific
 to Azure or MIcrosoft; none are relevant.
The only Options we want to use is `name` and `outputs`:
So we run - 
`mkdir DatingApp; cd DatingApp`
`dotnet new webapi -o DatingApp.API -n DatingApp.API`


The instructor installs like infinite extensions, but we only install the following Extensions:
C# 1.16.2 (latest) - Microsoft (powered by OmniSharp) 
C# Extensions (latest) - jchannon
NuGet Package Manager (latest) - jmrog

~ If we see 'Required assets to build and debug are missing from DatingAPp.API': add them! ~

--------------------------

So what do we have in our directory?

-------------

`Program.cs` & `startup.cs` are both involved in the start-up of our application.

`Program.cs` class is entry-point to our application.
When we run our app, `Main()` is the method invoked; note it calls `CreateWebHostBuilder`.
By right-clicking, we can see the definition. From there we can see that:
 - The main thing that function will do is to "use `Kestrel` as the web server and configure it using the app's 
   configurations providers."
  - `Kestrel` is a very light-weight server (as compared to IIS & Apache)
	- It will host our API. It will allow us to send HTTP Requests & get responses
Note that besides the `Main()` function, there is also the `CreateWebHostBuilder` which performs actions with the `Startup` class.

`Startup` class holds our application's start-up methods. We will come back to this file time-and-time again.
A few methods of note:
`ConfigureServices`: Allows for dependency injection of our services - making classes available in other classes!
    - If we want to inject a serviec anywhere, we need to add it to this function.
`Configure()`: configures HTTP requests pipeline based on whether we are in dev environment
 - `UseDeveloperExceptionPage`? The develeoper friendly exception page: provides details at point of error.
    - We hide this for our non-dev builds to prevent hacking!
 - `app.useHsts()?` : A security enhancement specified by a web app through use of a special response header
	- Once a browser receives this header, it won't send any communications over HTTP; only HTTPS!!!!
	- This works in conjunction with `app.UseHttpsRedirection()`
		- We comment both of those methods out at first; will introduce security as we progress.
 - `app.useMvc()`? - MVC if the framework that we're using. This is __middleware__
    - Middleware: Software that connects network-based requests generataed by a client to the Backend Data requested.
	- Sits between our API endpoint & our Database !
    - Routes our request to the correct controller.
        - Request comes in to our API endpoint, then MVC directs this request to the controller.
    - How does it do this? 
        - Via `Attribute Routing`!

-------------

We also have `Properties/launchSettings.json`.
Within there we have 2 different profiles, each with certain launch configurations.
`DatingApp.API` is going to be launched for us by default.
We make 2 changes to this launch profile:
1) Since we don't need a browser, we set `launchBrowser` to `False`
2) Since we're not redirecting to Https, w remove the first `applicationUrl`

If we wanted to launch a Production rather than a Development server, we just swap "Development" for "Production"
 in a profile.

-------------

We also have `appsettings.json` and `appsettings.Development.json` which both specify behavior for 
 each environment.
The `appsettings.json` file is always used.
 If we're in development mode, then `appsettings.Development.json` will be run after, overriding matches from the original.



--------------------------

`Attribute Routing?`
Well, in `Controllers/ValueControllers` we see a `[Route("api/[controller]")]` annotation above our controller
 definition. This specifies that it is listening for Routes that confirm to the above pattern, where 
 `[controller]` is substited for the first part of a controller's name (the part that precedes 
 the word Controller).  
So, to hit our ValuesController, we need to hit `"http://localhost:5000/api/values"`. There can optionally be more 
 information passed in i.e. `"/api/values/{id}"`
When a request comes in, its the job of our framework to direct it to this controller, but then it is the job of
 the controller to pass it to the correct action within it.
 It does this via placing Annotations above its actions, such as `[HttpGet]` & `[HttpPost]`, as well as adding
  attributes to these Annotations `[HttpGet("{id}")]`. These actions therefore funnel based on `ROUTE` & `VERB`

--------------------------

So now, let's run our API!

How?
Hit `dotnet watch run` from `DatingApp.API` to start the API so it watches the codebase and updates automaticaly when 
 there's a change.
In the terminal, you can see `Hosting Environment: Development`. 

Then in browser hit `localhost:5000/api/values` (+"/5")

Now we're clearly getting a lot of info when we hit the API; this is because we're running in development.
But where is this behavior specified?
Well we can configure the behavior of our API in each environment through the `appsettings.json` and
 `appsettings.Development.json` files.

Note we also check our environment in the `Startup.cs` file and show a `DeveloperExceptionPage` in dev.

We can see this, by manually updating a function in our API to throw an Exception. 
`throw new Exception("Test Exception");`

If we want to test our API in different browsers, we can swap `Development` for `Production` in our Profle in 
 LaunchSettings.

But note - even if we are in production mode, we do get that same level of detail in our terminal!


--------------------------

Now, let's create a DB & retrieve data from there.

This is a 2-part process:

-------------

1) Create a model & set up DB Service

We do this using the `Model/Code First Approach`: using the model to scaffold our database

1) Create a `DatingApp.API/Models` folder; then right-click + New Class & create `Value.cs`
2) Populate the Value Model. 
~ Now, we need to tell our ORM (EF) about it, since our ORM is responsible for scaffolding our DB and querying from it ~
3) Create a DataContext object. To do so: create a folder `Data` & a class `DataContext` within it, inheriting from 
 `DbContext`. 
  - A `DBContext` represents a session with the Database and can be used to query and save instances of your
	 entities.
  	- So if we have a Values table in our DB, then we use DbContext to send a query via Entity Frameowrk to 
		 the DB and then EF will return the results back to the calling method!!
  - A `DbContext` MUST have an instance of `DbContextOptions` to function. So we need to pass it in to the base constructor.
  - First we create a constructor in for our `DataContext` and include a parameter there of tpye `DbContextOptions<dataContext>` and then pass a reference f that object to the base constructor.
4) Now in our DataContext class, to tell EF about our entities we need to give it some properties of type `DBSet<x>`, where x is the model we want to import.
  - We need to give this DbContext some options. We tell it to useSqlLite with a connection string. For now, we leave that 
   as default.
  - To do so, install `Microsoft.EntityFrameworkCore.Sqlite`
  - Once we install it, we will have a `DatingApp.API.csproj` file in our directory.


--------------------------

2) Set-up connection to the Database

To connect to our SQLLite Database, We need a real connection string.
>   In `appsettings.json` we add `"ConnectionStrings":{"DefaultConnection":"Data Source=DatingApp.db"}`.
	- The naming convention is unique to SQLlite.
	- This will create a file which will be a DB that we can then use in our app.

Now back in `startup`, we need to tell it about the connection string.
 Observe that it is injecting `IConfiguration` already. Therefore, we can easily access settings set in our 
 `appsetings.json` file.

Now, we're in a position to use EntityFramework to scaffold & create our Database.
Open our Terminal, and run 
> `dotnet ef -h` to see all commands we can use with Entity Framework.

When we create a migration, EF is going to look at our `DataContext` class, and then create tables in our DB
 based on our `DBSets`
> `dotnet ef migrations add InitialMigration`
This creates Migrations folder. Look at the contents:
`DataContextModelSnapshot.cs`: EF's way of keeping track of the migrations that have been applied
`Designer.sc`: decides what to remove from Snapsot file
`_InitialCreate.cs`: 
`Up` method contains all the info EF needs to create a DB, or create Tables, or change our DB
`Down` method that undoes all of the work of a migration. IF you want to roll it back, call the Down 
 method.

Now to create & update a database with the contents of all of our migrations. Do so with the following:
> `dotnet ef database update`
This will create for us a `DatingApp.db` file.
We can explore it with Db Browser for SQL Lite
We went in and added 3 new Data Records just for dummy-data.

-------------

Now we want to read these values with DbContext.
First, we have to connect the two.

To do this, we quite simply inject our `DbContext` into `ValuesController` by specifying it in our constructor. For ease of use, we also store it in a new local variable.

Then, instead of our functions returning dumb data, we just return the new good stuff, using 
 the `Ok()` method of `Microsoft.AspNetCore.Mvc`,.

Now instead of returning `ActionResult<IEnumerable<string>>`, we return `IActionResult`, which means instead of just returning strings, we can return HTTP messages like OK

With the default API build, when we make a request, one of the API's threads becomes blocked until the  call has been made to the DB and the data has returned. Therefore the API can only concurrently 
 handle the same # of calls as it has # of threads
 - This isn't scalable, sooo....

For sake of scalability, we move to using __Asynchronous code__!
1) Change function definition `public IActionResult GetValues()` -> `public async Task<IActionResult> GetValues()`
2) Change `var x = _context.Vals.ToList()` -> `var x = await _context.Vals.ToListAsync()`
So you change 4 things: in fxn defn you add `async` and `Task`; in call to DB you add `await` and use `async` v of
 fxn if it exists


----------------------------------------------------

Now its time to create our Angular Project!!
Instructor uses `@angular/cli@6.0.8`
We do this w the `Angular CLI`, creating a new Ang project w: `ng new DatingApp-SPA`

Angular Directory:
`e2e`: End2End (we ignore)
`node_modules`: directory of all dependencies
`package.json`: all the project dependencies that'll be installed in `node_modules`
	- Also have `scripts`. We can use `npm start` or `ng serve` to start our app

Our bundler injects our `main.ts` script into `index.html` file at runtime when it builds it. `main.ts` holds the 
 start-up code of our app and is the point-of-entry for our logic. 
`Webpack` is our bundler - module bondler and a task runner: bundles our application into JS and injects our JS into
 our index.html file whewn we build it.
`Angular.json` stores the configuration for Webpack (with its complexitiy abstracted away.)
 - Note it has an "index" html and a "main" ts file. It will bundle that main file and then inject it into index
 - The TS needs to be compiled into JS that our browser can be rendered; this is done by webpack too.

Some Angular extensions:
Angular v6 Snippets - John Papa
Angular Files - Alexander IVanichev (Ignore; makes it too easy)
Angular Language Service - Angular
Angular2-switcher - infinity1207
Auto Rename Tag - Jun Han
Bracket Pair Colorizer - CoenraadS
Debugger for Chrome - Microsoft
Material Icon Theme - Philipp Kief
Path Intellsense - Christian Kohler
Prettier - Esben Petersen
TSlint - egamma

So now we want to create a new component named `value`. We do so via the command line `ng g c value`.
 This will automatically generate an `app/value` directory with `html, css, ts, spec.ts` files & will update 
 `app.module.ts` to `import` the new component & include it in the `declarations`

The `@angular/http` package is currently deprecated and will be removed in Angular7. We should instead use
 `@angular/common/http-client`. We don't need to change anything in `package.json` for this hough, since we 
 already have `@angular/common`. Simply need to make sure to tell `app.module.ts` to import the right file.

Now in `app.module.ts` we import `HttpClientModule` from `@angular/common/http` and add it to our imports array.

Now we want to use our HttpClientModule in our `value.component.ts`, and to do so, we inject it by importing it 
and then adding it as a parameter of our constructor. We put the `private` keyword to tell Angular that we want to
store it a a var also. Then, with our HttpClient imported, we can now use it to make requests to our API endpoint. 

We attempt this and see we get an error: `No 'Access-Control-Allow-Origin' header is present`. We are therefore not
 allowed access.
CORS : Cross Origin Resource Sharing
	- Security measure stipulating which clients are allowed to access our API.
	- The problem arises when we try to make a request to :5000 from :4200. We could easily go to :5000/values in 
	 our browser and we don't get that error.
	- If we look at the Network tab, we see that the request went just fine and we can see the correct response.
	 The browser just refuses to show the response however. 
	- To fix this, we go back to our API: `Startup.cs` and add `services.AddCors()` & the `app.UseCors` function

Once that is resolved, we can update our .html file to reflect the response in the markup. 

To prettify that, we use Bootstrap & Font-Awesome by running the following in our `DatingApp-SPA directory`
`npm install bootstrap font-awesome`
Now we need to include those style-sheets in our project. One way could be to go to "styles" in 
 `angular.json` & include the links in the syles[] there; but that array doesn't order the files, 
 and since CSS code gets overwritten ("cascading"), there's no guarantee that our CSS will behave as expected.
So instead, we go to `styles.css` and update it there.

Now when we used `ng new` Angular automatically initiated a Git project for us.
We don't want this for the course. Instead, we want a single Git Repo for our FE & our BE!
So how do we remove the Git Repo from `DatingApp-SPA`?
The easiest way is to remove the `.git` folder. We leave `.gitignore` and the other one. Only remove `.git`
The `.gitignore` file specifies that Git shouldn't keep track of certain files like `node_modules`

So we move one level up, to `/DatingApp/` & run `git init`.
Then we need to create a `gitignore` file for our API.
We physically create a `.gitignore` file there







------------------------------------------------------------------------------------------------------------------





Section 3 : Security




---------------------------


In this module we are going to:
	- How to store passwords in the DB
	- Creating the User Model
	- The Repository Pattern
	- Creating the Auth Controller
	- DTOs
	- Token Authentication
	- Auth Middleware

------

Never want to store cleartext passwords.
You can suggest we Hash the password with SHA512, but a few problems:
1) There exist many services out there that store a Database of SHA512 hashed common-passwords. They then run a 
 search of their DB to attack relatively simply.

Hashing is good, but not enough on its own.
So you need to add a Salt to the password before you hash it! A Salt is a randomly generated string that ensures
 the same clear-text password maps to different stored entries. A salt is stored in the DB along with the result
 of the Hash Function. It prevents the same attack-vector of storing Hashes of commonly used passwords in a DB.
 That way __hackers cant determine if the same person uses the same password a cross diff systems!!!__
Hashed value = SHA256 (Salt value + Password)

Back in the API, let's create a User Model to scaffold the User table for us!
1) Create `Models/User.cs`
2) Tell our DbContext about this by adding it in `DataContext.cs`
3) Add a migration & update database: `dotnet ef migrations add AddedUserTable` and `dotnet ef database update`

Thus far we've retrieved data from our DB by using the context directly in the controller. But theres another way:
__The Repository PAttern__

It's not scalable to add methods directly into our controllers.
There's already a layer of abstraction between our controllers & the Datbaase: Entity Framework.
We query EF and EF translates this into SQL.
But we should add a further level of abstraction, which we can do with the Repository Pattern

Warehouse Metaphor:
We're currently asking each controller to independently (with the help of EF but still independently) go through
 the warehouse and retrieve everything it needs to directly.
	1) The controller is very tied to this ware-house; if we change the lay-out, then it needs to relearn everything
	- Currently, b/c of EntityFramework we can get away with changing our DB: it abstracts that away. 
	 However, we are still tied to Entity Framework as our ORM and if we want to change it we need to
	 re-write our controllers, which is not ideal.
	2) If we add add'l controllers, they all need to repeat the exact same work

So we add an additional layer of abstraction between Entity Framework & our controllers.
The Controller communicates with the Repository Interface which exposes methods. The controller has no 
 idea how these methods are implemented. It only needs to know the methods exposed
The repository interface of course maps to an implementation which makes all of the queries itself to the DBs

Why should we use Repository Pattern?
1) Minimizes duplicate query logic
2) Decouples application from the persistence framework or ORM (Entity Framework)
3) Keep all DB queries in same place; makes things easier & readable
4) Promotes testability

Steps:
1) Create an Interface file; we call it `Data/IAuthRepository.cs`. Declare it an interface and populate it
2) Create a file to hold implementations: `Data/AuthRepoistory.cs`. Have it implement the interface we just created
 & write out funxns. We must inject `DbContext` here because this will be managing Data.

In the case of Registration & Authentication (sinnce this is Auth anyway), we rely on the `User` model from beofre
The code is shown in the C# file.

Now we need to tell our app about our Auth & IAuth Repositories. We add it as a Service in `Startup.cs`
 so we can then use it throughout out app.
Now in `ConfigureServices` we run `services.`
3 options:
	1) `AddSingleton`: single instnace of repo for our apps. Creates it 1 then uses it over and over for all calls
		- Issues with concurrency therefore we ignore. Doesn't fit out purposes
	2) `AddTransient`: Useful for light-weight statelss services; these are created each time for a new request
		- Each time a request comes in for our repo, then a new instance of our repo is created.
		- Great for light-weight, but not exactly for what we need.
	What we want is somewhere in the middle fot hese:
	3) `AddScoped`: Service created once per reqeust within the scope. Creates 1 for each HTTP request, but
	 uses the same instance in other calls within the same web request...


***********
Debugging: 
- If we want to debug a process, we can open the Debug window (shift+cmd+D), and attach to a process from there.
- Set a break-point somewhere.
- Next to the Green Arrow, it will say "No Configurations". Go in and add a configuration to `.NET Core`.
- You'll then be moved to `launch.json` and will have some options. We select `.NET:Attach to local .NET Core...`
- This gives you a configuration called ".NET Core Attach".
- Now in the drop-down you'll have `.NET Core Attach`
- Start your BE server by running `dotnet run` or `dotnet watch run`
- Then hit the green arrow and select `dotnet : DatingAPp.API.dll`
***********

------------------------

Token Authentication:


JWT: JSON Web Tokens
	- Industry standard for tokens (RFC7519)
	- Self-contained piece of data
	- Server doesn't need to go back to DB to validate the user.
		- Server can validate token itself w/o calling the data store.
			- Can decide for itself whether person is authenticated to use the app

Structure of JWT:
3 parts:
(1) Header
{
	"alg": "HS512", //ALgorithm used to encrypt it
	"typ": "JWT //Type of the token
}
(2) Payload: Data stored in the token.
{
	"nameid":"8",
	"unique_name": "frank",
	"nbf":1511110407, //not before timestamp: earliest state the token can be used
	"exp":1511196807, //expiry timestamp: token not valid after
	"iat":1511110407 //issued at timestamp
}
(3) Secret: this is what's used to encode or hash the header & the payload
HMACSHA256(
	base64UrlEncode(header) + "." + 
	base64UrlEncode(payload),
)
Secret is stored on the server and is never revealed to the client
Client sends token to the server, server uses their secret to validate the token
Bear in mind that the client can decode the header & payload 
All the above 3 parts get hashed into 1 string:
"asfhui3452389.dsih8325820afasf.-JHSAK89_ASD8UAFASAKGLA`

1) Client sends username and password to Server
2) Server validates and sends JWT to Client
	- In case of auth, Server hashes password & compares it to hashed pwd in DB
		- If match, it sends this JWT.
	- Client stores JWT locally.
3) Client sends JWT for further requests to Server
4) Server validates JWT and sends back response to Client
	- Server doesn't need to go to data-store or check username & pass or anything like that.
	- Simply by looking at the token, the server's able to verify the user


Now we can take the token and put it in `jwt.io` to decode it & get all of the values stored within it.
Therefore, without specifying the signature, the client is able to unhash the token & see what's inside it.
However, the client is not able to fool the server with fake tokens due to the signature on each token - they each
 reflect the contents of te token within it & change as we change the contents.

---------------

Now lets add authorization middleware to our API:

The data annotation [Authorized] requires authorization, whereas the [AllowAnonymous] allows anyone to hit it.
However, we need to specify to our code how it performs authorization. We do that by adding to our `./Startup.cs`
We need to add AUthentication as a service:
`service.ADdAuthentincation(....`


Now to test this in Postman, we:
1) Hit `/api/values/3` and confirm it lets us thru
2) Hit `/api/values/` and confirm it says unauthorized
3) Hit `/api/auth/login` with credentials to get a token
4) Hit `/api/values/` with a Header key: Authorization 	Value: Bearer token
	- Where token is the pasted value of the token w/ no "" or any formatting. Just plaintext
	- There is a space between Bearer and token



Summary:
- How we store passwords in DB
	- Password Hash + Password Salt
		- Therefore if DB is compromised, can't crack passwords (needs too much computatuonal power)
		- Can't predict hashed password from plaintext password
- Created the userModel
- Repostiroy Pattern
- AUthentication Controller & methdos to log-in/register
- DTOs
- Token Authentication (JWTs); lightweight from client -> server.
- Authentication MIddleware







------------------------------------------------------------------------------------------------------------------





Section 4 : Client side login & register




---------------------------


Creating the Nav & Login Form:

We create a `nav` component to hold the navbar, using `ng g c nav` and then pasting the `navbar` element from a 
 template found on GetBootstrap there. 
We remove certain parts of it that we don't want since we don't use JQuery
Once done, we then add a basic form with 2 inputs and add some basic validation preventing it from being submit
 with an empty field.
We sync'd this up to a basic function in our component just to establish the connection b/w component & form

Now let's build it up further and connect it to the BE so the user is hitting the `/api/auth/login` function


