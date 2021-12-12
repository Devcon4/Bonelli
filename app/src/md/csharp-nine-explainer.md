# New features in C# 9.0
---
``` csharp
public record Person {
    public string FirstName { get;}
    public string LastName { get; init;}

    public Person(string firstName, string lastName) {
        FirstName = firstName;
        LastName = lastName;
    }
}
```
## Primer
C# 9.0 is the latest version of C# that ships with .NET 5. It adds several large, new features that will change how future C# code will look. It introduces the Record type, adds init only setters, and allows top level statements just to name a few of the new features. This post only covers some of the top level changes. There are many more smaller things and I would check out the [original post](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-9) to see everything that is new.

If you would like to see the full code I have a [repo](https://github.com/Devcon4/goshawk/blob/master/Program.cs) with a little examples of these new features. You do need .NET 5 to run C# 9.0.

## Overall changes

- Record types
- Init only setters
- Top-level statements
- Better pattern matching
- Shorthand new expressions

Now that we have that covered lets dive in and start looking and these new features!
## Record Types
---

Records are a new reference type similar to a class that are designed to be immutable and have better equality checks built in. Let's look at an example.

``` csharp
public record Person {
    public string FirstName { get;}
    public string LastName { get; init;}

    public Person(string firstName, string lastName) {
        FirstName = firstName;
        LastName = lastName;
    }
}
```

This should look fairly familiar to how we declare Classes. We create an object with some getters (we'll get the the init in a little bit). This isn't the only (or best) way to create a Record but I wanted to show how similar to Classes they are. Records support inheritance just like Classes although A Class can't inherit A Record and visa versa.

A big thing with Records is that they are Immutable. Once a Record property is declared it can't be changed. You can copy a record and they even support `with-expressions` to create modified copies.

``` csharp
    public record Actor(string firstname, string lastname, string Role, double? Pay): Person(firstname, lastname);

    var irwin = new Actor("Steve", "Irwin");
    var buscemi = irwin with { LastName = "Buscemi", Role = "Donny" };
```

In this snippet we declare a Record called Actor using the `positional records` syntax. We then create an instance of that record called `irwin` then copy that record to `buscemi` but modify the `LastName` and `Role` properties.

Earlier I mentioned that there was another way to declare Records called `positional records`. This is the shorthand declaration shown above. This syntax does several things for us automatically. First it creates all the properties declared with get and init. It will also create a `Deconstruct` method for us. `Decunstruct` is a relatively new feature to C# that allows for object deconstruction syntax. For classes it's kind of a pain to use because you have to declare this method manually to be able to use it, here is an example.

``` csharp
public class Reviewer {
    public string Name {get;}
    public string Organization {get;}

    public Reviewer(string name, string org) {
        Name = name;
        Organization = org;
    }

    public void Deconstruct(out string name, out string org) {
        name = Name;
        org = Organization;
    }
}
var reviewer = new Reviewer("Tom", "IMDB");
var (revName, _) = reviewer;
Console.WriteLine(revName);
```

Records are a pretty neat new addition. I think the future of C# will be using class to represent Services/Logic and Records for Models/Entities/DTOs. I think that separating logic and data is a good thing. Now lets look at the Init only setters!

## Init only setters
---

Sometimes you want properties on an Object to be readonly, but only adding a getter means the only way to create that Object is with the constructor.

``` csharp
public class Director {
    public string Name { get; }

    public Director() {}

    public Director(string name) {
        Name = name;
    }
}

// Correct way to create new instance.
var joel = new Director("Joel Coen");

// This doesn't work because Name doesn't have a setter!
var ethan = new Director { Name="Ethan Coen" };
```

What Init only setters allow us to do is to use the latter syntax in the above snippet to create Objects. This allows for less boilerplate code and better flexibility in using the language which I think is great. `Positional records` automatically will have Init only setters added to their properties. Here is an example.

``` csharp
public class Director {
    public string Name { get; init; }
}

// Works!
var joel = new Director { Name="Joel Coen" };
// This will explode because it doesn't have a setter (what we want to happen!).
joel.Name="Ethan Coen";
```

### Top-level statements
---

You may have noticed that the above statements and the example repo don't have a `main` method. This is actually valid C# code! This feature was added specifically for use cases like this blog post. Cases where you want to show an example of some code that isn't a "Formal" C# program. Don't worry though C# hasn't turned into an Interpreted language like Python or Javascript. You can only have top-level Statements in one file (you will get a compiler error if there is multiple). This feature is really only to make it easier to learn C# and create runnable examples. You shouldn't have Top-level Statements in "real" projects.

Before:
``` csharp
using System;

namespace HelloWorld {
    class Program {
        static void Main(string[] args) {
            Console.WriteLine("Hello World!");
        }
    }
}
```

After:
``` csharp
using System;

Console.WriteLine("Hello World!");
```

This is great for what I do and make it much easier to teach C#. Currently with dotnet core all you need for a c# program is one .cs file and one .csproj! Compare that to .Net framework and all the boilerplate to get a project started.

### Better pattern matching
---

The last feature I want to talk about is the improvements to pattern matching. Pattern matching is getting pretty powerful in C#. Here is an example checking if a char is a letter.

``` csharp
public static class CharExtensions {
    public static bool IsLetter(this char c) =>
        c is (>= 'a' and <= 'z') or (>= 'A' and <= 'Z');
}
```

The `is` operator is the heavy lifter here that starts the pattern matching. There is also the `and` and `or` keywords (different than ||, && bitwise operators). The main case I care about is for null checks. Here is an example of null checking a string.

``` csharp
string value = "";
if(!String.IsNullOrEmpty(value)) Console.WriteLine("old!");
if(value is not (null or "")) Console.WriteLine("new!");
```

Both of these are valid ways to check if a string is not null or empty. The first using the `String.IsNullOrEmpty` helper where as the second one is using pattern matching. This will probably become a common pattern in the future to just use pattern matching rather than the built in helpers which I think is great.

## Conclusion

There are many more small changes and additional details in the Microsoft post. Overall I really like these additions and can't wait to see how these features are used in the future.
