# .Net Basics
---

## Introduction
.NET is the modern refreshed version of the C# development ecosystem. With it brings many new ideas/concepts that help simplify what you need to know about how to build/run application.

This article will cover some of the conceptual differences between modern .NET coming from a Framework background. We will breakdown DI, Hosts, and the new CLI.

## Key Concepts
There are several key concepts to understand about how .NET applications work.

- [CLI](#cli)
- [Hosting Model](#hosting-model)
- [Configuration](#configuration)
- [Environment](#environment)
- [Dependency Injection](#dependency-injection)

Before we look at these in more detail lets create a simple .NET app in order to understand better what we are talking about.

### CLI

.NET now has a very powerful CLI to do all the same options we used to be locked into an IDE to do. You can still use whatever IDE you prefer but it is no longer required. 

Some examples of useful commands.

- `dotnet run .`
- `dotnet watch run`
- `dotnet new webapi`
- `dotnet add package Microsoft.Extensions.DependencyInjection`
- `dotnet sln add .\netExample.Domain`
- `dotnet ef migrations add Init`
- `dotnet ef database update`

We can generate a new webapi project by using this command.

`Dotnet new webapi`

This will created the basics required to run a .NET webapi server. Depending on what version of .NET you are using your output might be different. Lets update the generated Program.cs with the below code.

*Program.cs*

``` CSharp
using netExample;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddWebApiServices(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();

app.Run();
```

Lets also create a new file called `ServiceConfiguration.cs`.

*ServiceConfiguration.cs*

``` CSharp
namespace netExample;

public record CustomConfig(string Host);

public static class ServiceConfiguration {
  public static IServiceCollection AddWebApiServices(this IServiceCollection services, IConfiguration configuration) {
    services.AddHttpContextAccessor();
    services.AddControllers();

    services.Configure<CustomConfig>(configuration.GetSection("Custom"));
    return services;
  }
}
```

Now that we have some actual code to play with lets take a look at those concepts again.

---

### Hosting Model

The core of a modern .NET project is its new Hosting Model. A Host is a convenient builder which provides an application Lifecycle as well as entry points to setup configuration and services for the application. There are multiples types of Hosts, for example you can create a Host for a CLI application using `var builder = Host.CreateApplicationBuilder(args);`. Because we are building WebApi's we normally use the WebApplication specific host `var builder = WebApplication.CreateBuilder(args);`.

This gives us a builder which we can then register additional services and configuration. We can then call `var app = builder.Build();` to create the actual host instance. You can break down this process into two parts. First we **Register** things to be available, this happens on the Builder. Second we **Enable** things to actually use features that have been registered, this happens on the App.

In our example code we call `services.AddControllers();` as part of registering. We then call `app.MapControllers();` to enable those controllers to be served. 

Finally to start our Host we call `app.Run();`. Our host will now run until it errors or is closed by the application. For a WebApi this is where it begins serving our web server on the specified port.

### Configuration

Often we will want to specify some sort of configuration to our application. In Framework we might do this using our Web.Config, stored in the DB, or some custom solution. In modern .NET there is a new standardized system for loading configuration.

*appsettings.json*

```JSON
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Custom": {
    "Host": "myDomain.com"
  }
}
```

Appsettings files are used to setup runtime application configs. You will often also see Environment specific configs like **appsettings.Development.json**. Our host by default will look for these files and include them. We can also customize this, for example to look in a specific folder `builder.Configuration.AddJsonFile("settings/appsettings.json", optional : true, reloadOnChange : true);`.

We can access these configs using the `IConfiguration` object. In our example code above we do this with the line `services.Configure<CustomConfig>(configuration.GetSection("Custom"));`. This grabs the 'Custom' block from our appsettings and registers the Record `CustomConfig` with its values. Because it is registered to the DI system we can then inject it into any class using the `IOptions` utilities.

*CustomController.cs*

```CSharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace netExample;

[ApiController]
[Route("api/[controller]")]
public class CustomController : ControllerBase {
  private readonly CustomConfig _config;

  public CustomController(IOptions<CustomConfig> config) {
    _config = config.Value;
  }

  [HttpGet(Name = "getConfig")]
  public CustomConfig GetConfig() {
    return _config;
  }
}
```

### Environment
Similar to configuration, Environments help us do action specific to where we are running our code. It is through the Environment config that our Host loads the *appsettings.Development.json* or not. You can also create custom environments if you need but often the defaults are sufficient. In our example above we use the Environment on the app to enable the SwaggerUI only if we are built for Development.

``` CSharp
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
```

### Dependency Injection
Dependency Injection is now a first class citizen in modern .NET. We no longer need to use libraries like StructureMap etc to accomplish DI. When we talked about registering things above that is adding them to the new DI system in .NET so they can be referenced later. The root of the DI system is the `IServiceCollection`. This is the DI container which holds the collection of registered services. We will extent the IServiceCollection to better organize what is injected. We do this using the `ServiceConfiguration.cs` pattern shown above. Calling `builder.Services.AddWebApiServices(builder.Configuration);` uses that extension method to bootstrap needed services for the application.

There are three main ways you can register a service.

**AddSingleton**: `services.AddSingleton<CustomService>();` Creates a single instance of the class that will be used anywhere it is injected.

**AddScoped**: `services.AddScoped<CustomService>();` In a WebApplication it creates a new instance per API request. If it is injected multiple times during that request it will be reused.

**AddTransient**: `services.AddTransient<CustomService>();` Creates a new instance every time it is injected.

In general most things in our applications should be registered using `AddScoped`. It is common we would want to inject an Interface rather than a concrete implementation. In order to do that we need to specify what class to use as the implementation `services.AddScoped<IService, CustomService>();`. Now if we injected `(IService myService)` we would be given an instance of CustomService. Say we injected a second implementation of IService `services.AddScoped<IService, OtherService>();`, we could now use `(IEnumberable<IService> myServices)` to get all implementation of that service.

The `IServiceCollection` is only the mechanism used to register services. Once we call `builder.Build();` to create our app that will build an `IServiceProvider`. In general we shouldn't need to use this and prefer to inject directly what we need, but it is a useful tool used in cases where we are not in the context of a request (startup, background task, etc). If we inject the service provider we can call `sp.GetService<CustomService>();` to get an instance manually.

There are more tricks and cool things you can do using the new DI system but this is the basics you need to know in order to start using it.

---

### Kestrel

There is one last concept I would like to cover which is specific to WebApplications and that is the underlying Web Server itself. Kestrel is a brand new Web Server that comes with ASP.NET. Rather than needing a separate dedicated server (IIS) which then calls our application we now build that Web Server into our application. This better aligns .NET with how other languages work and is way easier to use and rationalize about. Best part is it is all done as code.

We don't need to do anything specifically to enable kestrel, it is created by default in ASP.NET and when we call `app.run()` it will be started and hosting on our specified port. There are a ton of customizations you can do to Kestrel. One common one we do is add `app.UseFileServer();`. This will statically serve any content in a *wwwroot* folder. This is super useful if you want to bundle a SPA application and serve it with your WebApi. 

There are Angular/React/etc SPA templates you can use with the `Dotnet new` command but I would not use them, they add a bunch of bloat like Razor to serve which we can simplify into the single command above. Conceptually I think it is important to think of your WebApi as separate from any SPA applications that consume it anyways. Often I will use another web server entirely to host the SPA files.

Sometimes you might be in a situation where you have to still serve your application through IIS. Thankfully there is a ASP.NET hosting module specifically for IIS that lets us do thing. Hosting this way we still end up using Kestrel under the hood but IIS can either In-Process or Out-Of-Process run our application and forward requests to it. Again ideally you should move away from IIS entirely, there are many limitations involved when you use it and you can't take advantage of all the new features available in .NET. 

### Conclusion

That is a rough primer on how modern .NET works. Each topic covers has much more underlying detail that could be gone over deeper in depth but this should help you understand exactly what is happening with out code. Overall I personally find .NET way more understandable in how it works and way less magical than Framework. 
 

 
  
-- Devyn






