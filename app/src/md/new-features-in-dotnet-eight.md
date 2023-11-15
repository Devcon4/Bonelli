# New features in .net 8
---

There are a ton of new features out in .net 8! Here is a brief overview of everything new.

### .net 8 features

- Container changes
- Frozen/Concurrent types
- Metrics API
- Keyed DI services
- Hosted Lifecycle Service
- Source Generators
- NativeAOT

### C# 12 features

- Primary Constructors
- Collection Expressions
- Array syntax
- Type Aliases
- Interceptors

### Container changes

All aspnet Linux containers now have a non-root user called `app`. This makes it easier to build non-root .net container. Non-root is preferred in deploying to cloud environments.

### Frozen types

There are a new set of collection types that target performance scenarios. This is the `FrozenDictionary` and `FrozenSet`. These types are read optimized and disallow changing keys. The GC is able to better allocate them in memory because they can only be read. They are great when you want to return an immutable type that only needs to be read.

### Metrics API

.net 7 introduced `Meter` and `Instrument` which can be used to record application Metrics. .net 8 expands these with additional options like tags as well as a `CreateCounter` helper. Metrics go in hand with tools like Prometheus to build dashboards, stats like concurrent connections, jobs ran, etc. These are separate from Structured Logging and popular in cloud setups.

### Keyed DI Services

You can now label injected services using a key. This is similar to how Angular injection works. This is great for cases where you have multiple implementations of an interface that you want to use.

```csharp
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<BigCacheConsumer>();
builder.Services.AddSingleton<SmallCacheConsumer>();

builder.Services.AddKeyedSingleton<IMemoryCache, BigCache>("big");
builder.Services.AddKeyedSingleton<IMemoryCache, SmallCache>("small");

var app = builder.Build();

app.MapGet("/big", (BigCacheConsumer data) => data.GetData());
app.MapGet("/small", (SmallCacheConsumer data) => data.GetData());

app.Run();

class BigCacheConsumer([FromKeyedServices("big")] IMemoryCache cache)
{
    public object? GetData() => cache.Get("data");
}

class SmallCacheConsumer(IKeyedServiceProvider keyedServiceProvider)
{
    public object? GetData() => keyedServiceProvider.GetRequiredKeyedService<IMemoryCache>("small");
}
```

### Hosted Lifecycle services

To go along with `IHostedService` there is now an `IHostedLifecycleService`. The difference is this new service includes additional lifecycle hooks for cases where you need greater control in a HostedService.

### Source Generators

Source Generators are a new collection of helpers using the new c# 12 Interceptors. These allow extensions for compile type checks. With the new `EnableConfigurationBindingGenerator` enabled it will generate compile time types for IConfiguration. We don't see this change in our source code but it allows the compiler to not use reflection and is `trim-friendly` which is used for AOT builds.

### NativeAOT

Native AOT was introduced in .net 7 but is much more supported in 8. Traditionally when we build a .net application it is compiled down to IL (Intermediate Language) which is in .dll files usually. Other languages also build to IL like F#, etc. This IL then needs a .net Runtime installed which can read/run them. This is why we usually only have one type of build. When that runtime then starts one of our applications it needs to compile it to actual machine code that is compatible with the given OS/hardware. While this has many positives it also has these key downsides.

- Requires a Runtime installed on the target system.
- Larger file sizes.
- Slower application starts.
- Not a single executable file.

Native AOT allows us to combat these downsides by compiling our application for the target system Ahead-Of-Time. We can also bundle the runtime into our code so we don't need to setup our target system before hand. Other newer languages do this as well (golang, rust, etc) and this makes .net match. This is also great for containers. As well we can use new tricks like `trimming` to only include parts of the runtime we actually call. This is similar to tree-shaking in frontend development. Trimming requires libraries to be built in a way that lets the compiler know if it is `trim-friendly`. This is where new features like SourceGenerators and Interceptors are useful. The big change in .net 8 is many of the standard libraries using interceptors to make them trim-friendly. We don't really need to do much or know interceptors to take advantage of these coming changes but they are useful to know about.

---

### Primary Constructors

One large change in c# 12 is the introduction of primary constructors. This is a new constructor syntax which is designed to help eliminate some of the boilerplate required to build a constructor. This is especially useful in DI.

```csharp
// Records already used primary constructor style syntax.
public record WeatherConfig(string ApiKey, string BaseUrl);

// With classic constructor syntax:
public class WeatherService {
  private readonly ILogger<WeatherService> _logger;
  private readonly WeatherConfig _config;

  public WeatherService(ILogger<WeatherService> logger, IOptions<WeatherConfig> config) {
    _logger = logger;
    _config = config.Value;
  }

  public void LogConfig() {
    _logger.LogInformation($"ApiKey: {_config.ApiKey}");
    _logger.LogInformation($"BaseUrl: {_config.BaseUrl}");
  }
}

// With primary constructor syntax:
public class WeatherService(ILogger<WeatherService> logger, IOptions<WeatherConfig> config) {
  private readonly WeatherConfig config = config.Value;

  public void LogConfig() {
    logger.LogInformation($"ApiKey: {config.ApiKey}");
    logger.LogInformation($"BaseUrl: {config.BaseUrl}");
  }
}
```

There still may be cases where a traditional constructor is preferred, or you might still declare a field manually, but in most cases primary constructors can be used to simplify our code and make it easier to do DI.

### Collection Expressions

Another large change is the introduction of Collection Expressions. In short it is a simplified syntax for creating lists of things. As well it introduces the spread operator `..` which allows us to merge arrays simply.

```csharp
public class NumberService {
  public List<int> ExtendSet(List<int> mainSet) {
    // Original syntax.
    List<int> set1 = new List<int>() { 1, 2, 3, 4, 5 };
    // Simplified syntax.
    List<int> set2 = new() { 6, 7, 8, 9, 10 };
    // Collection Expression Syntax.
    List<int> set3 = [11, 12, 13, 14, 15];

    // Old way:
    // return mainSet.Concat(set1).Concat(set2).ToList();

    // New way using the spread operator:
    return [.. mainSet, .. set1, .. set2];
  }
}
```

### Type Aliases

We can now create aliased names to existing types in c#. This is useful if you want to simplify a complicated type declaration into a simpler syntax. It is also useful to create named types for ValueTuples.

```csharp
// Rename silk Vector3D<float> to V3 and Vector2D<float> to V2.
using V3 = Silk.NET.Maths.Vector3D<float>;
using V2 = Silk.NET.Maths.Vector2D<float>;

// Create a type alias for ValueTuple<float, float, float, float>.
using Rect = (float x, float y, float width, float height);

public class TransformService {
  public Rect Viewport { get; set; } = (0, 0, 1920, 1080);
  public V3 WorldOrigin { get; set; } = new V3(0, 0, 0);

  public V2 WorldToScreen(V3 world) {
    var screen = world - WorldOrigin;
    var (_, _, Vwidth, Vheight) = Viewport;
    screen.X *= Vwidth;
    screen.Y *= Vheight;
    return new V2(screen.X, screen.Y);
  }
}
```

### Interceptors

Interceptors are not something we really will write but are important in enabling Native AOT. In short it allows individual method call implementations to be overridden at compile time using attributes. This is used to mutate the standard library at compile time to make it trim-friendly or to avoid using runtime reflection by generating types.

---

### Conclusion

There are many more things not covered here but this is the highlights. .Net is getting many new exciting features. .Net 8 is finally released as well so we can start taking advantage of all these new things!
