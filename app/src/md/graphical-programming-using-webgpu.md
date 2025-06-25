# Graphical programming using WebGPU

---

Graphical Programming is a quite complicated field of software engineering. There are many "right" ways to do things, competing standards, and advanced mathematics. Performance is king of the space with lower frame times and impressive visuals the ultimate goal. WebGPU is great starting point for someone wanting to understand the techniques and practices used behind the scenes of nearly every video game or complex graphical application out there.

This article is based on this repo: [https://github.com/Devcon4/Bunting](https://github.com/Devcon4/Bunting)

## Why WebGPU?

For those familiar with the web you may have used an HTML Canvas before. With canvas you have the idea of a Context, typically a CanvasRenderingContext2D or a WebGLRenderingContext if you are doing something fancy. These can be useful but if you have done more traditional Graphical Programming these leave much to be desired. Alternatively you may have used other modern Rendering APIs like DirectX 12 or Vulkan. WebGPU is by far easier to implement than these raw APIs. WebGPU is a great middle ground for prototyping and learning new techniques between these two worlds.

## Render Pipelines; A history

Back in the early GPU days everything worked on the Fixed Function Pipeline. An easy way to imagine how this worked is similar to a calculator. You could use the GPU to do simple calculations for you that are pre-defined. For example blending two textures together is a classic use case. While great at accelerating certain operations it is limited in what it could do, everything was hard wired in the hardware.

The next evolution was the introduction of the programmable shaders and the Rendering Pipeline. This is when shader programs became something you could actually write yourself rather than being baked into the hardware. You could now write a dedicated Vertex or Fragment shader. This unlocked tons of new possibilities, but still has many limitations. Generally you still used a well defined rendering pipeline built into the API. Each API had a slightly different pipeline but generally they followed the format here.

**Input assembler > Vertex Shader > Tessellation > Rasterization > Fragment Shader > Blending**

Finally we reach modern APIs in our history timeline. The above pipeline is the standard but not every task is suited to follow that flow. For example say we want to do non graphical tasks like simulating wind in our game. There are also other approaches to the standard Vertex/Fragment like Gaussian Splatting or Mesh shaders. This is where compute shaders and the Programmable Pipeline come in as part of modern APIs. We can now declare our pipelines, how data moves between them, and other factors ourselves.

Now that we have some background lets begin looking into our more concrete example.

## Triangle Example

---

Everyone who gets into graphics programing has created an example triangle app. It is the hello world of the graphics world. For brevity the code here is not a complete example. We will use code as a means to break down concepts rather than a step by step guide. Lets take a look. The source code for this post can be found here [Bunting](https://github.com/Devcon4/Bunting)

```Typescript
import { EngineData } from '../engine';
import { Ok } from '../errorHandling';
import { Pipeline } from '../Pipeline';

const TriangleData: {
  vertexBuffer: GPUBuffer,
  pipeline: GPURenderPipeline
} = {} as any;

Pipeline.RegisterInit({name: 'Triangle Pipeline'})(async (data: EngineData) => {
  console.log('Triangle pipeline initializing...');

  const vertices = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5
  ]);

  const rawVertexBuffer = data.device.createBuffer({
    label: 'Triangle Vertex Buffer',
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true
  });

  const vertexBuffer = rawVertexBuffer.getMappedRange();
  new Float32Array(vertexBuffer).set(vertices);
  rawVertexBuffer.unmap();

  const vertexShaderModule = data.device.createShaderModule({
    code: await fetch('./shaders/triangle.vert.wgsl').then(res => res.text())
  });

  const fragmentShaderModule = data.device.createShaderModule({
    code: await fetch('./shaders/triangle.frag.wgsl').then(res => res.text())
  });

  const vertexBufferLayout: GPUVertexBufferLayout = {
    arrayStride: 2 * 4,
    attributes: [{
      shaderLocation: 0,
      offset: 0,
      format: 'float32x2'
    }]
  };

  const pipeline = data.device.createRenderPipeline({
    vertex: {
      module: vertexShaderModule,
      entryPoint: 'main',
      buffers: [vertexBufferLayout]
    },
    fragment: {
      module: fragmentShaderModule,
      entryPoint: 'main',
      targets: [{
        format: data.format
      }]
    },
    primitive: {
      topology: 'triangle-list'
    },
    layout: "auto"
  });

  TriangleData.vertexBuffer = rawVertexBuffer;
  TriangleData.pipeline = pipeline;

  return Ok(data);
});

Pipeline.RegisterRun({name: 'Triangle Pipeline'})(async (data: EngineData) => {
  const commandEncoder = data.device.createCommandEncoder();

  const textureView = data.context.getCurrentTexture().createView();
  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [{
      view: textureView,
      loadOp: 'clear',
      clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
      storeOp: 'store'
    }]
  };

  const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);

  renderPass.setPipeline(TriangleData.pipeline);
  renderPass.setVertexBuffer(0, TriangleData.vertexBuffer);

  renderPass.draw(3, 1, 0, 0);
  renderPass.end();

  data.device.queue.submit([commandEncoder.finish()]);

  return Ok(data);
});

```

Let's break that down. First this pipeline is broken up into three function (init, run, cleanup) which are lifecycle functions in our engine code, What we care about is in the Init. Pipelines are essentially broken into these parts.

- Buffers: Declarations of data in the GPU.
- Shaders: How we attach WGSL scripts to a pipeline.
- Layouts: These can be quite confusing but aren't too bad. These are the glue between buffer data and our shaders. Another way to think of them is the format of data we will pass into our shader.
- Pipeline: This is what wires everything together. We can configure options on our pipeline as well as pass those layouts/shaders in here.

Now lets take a quick look at our run function. The main object here is the RenderPass. Think of this as a step in our render workflow. We setup the expected results (attachments) in a descriptor. Essentially we record a bunch of commands to perform on the GPU in order (CommandEncoder). We then finally submit those commands to our selected GPU device. Some of the commands we record are to fill buffers with data, draw calls, etc.

Finally what everyone has waited for, lets take a look the shader code!

```
// triangle.vert.wgsl
struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@vertex
fn main(@location(0) position: vec2<f32>) -> VertexOutput {
  var uv = (position + vec2<f32>(1.0, 1.0)) * 0.5;
  var pos = vec4<f32>(position, 0.0, 1.0);
  return VertexOutput(pos, uv);
}


// triangle.frag.wgsl
struct FragmentInput {
  @location(0) uv: vec2<f32>,
};

struct FragmentOutput {
  @location(0) color: vec4<f32>,
};

@fragment
fn main(input: FragmentInput) -> FragmentOutput {
  let color = vec3<f32>(
    input.uv.x,
    input.uv.y,
    1.0 - input.uv.x - input.uv.y
  );

  return FragmentOutput(vec4<f32>(color, 1.0));
}
```

Firstly we use WGSL language in WebGPU, this is similar to GLSL or other shader languages. I won't go too in depth on the shader language here, just know that for our vertex we basically pass through the UV coordinates. And our fragment shader is colored based on those UV coordinates.

Now that we can see the fundamentals of a pipeline lets step it up and move to 3D. To do so we will need to talk about a few new concepts like MVP and 3D Models.

## Cameras, MVP, and UBOs

Another concept we need to talk about are transforms. When we talk about a Transform really what that means is we construct a 4x4 matrix. A transform is a Vector3 position, Vector3 scale, and Quaternion rotation (Vector4). We can combine those three things into a single mat4x4 which is what makes it a very useful data structure.

Both cameras and Models will have a transform. How we pass those transforms is but using an UBO or Uniform Buffer Object. Think of this as a normal buffer but built from a Struct.

For a camera we often will refer to that transform matrix as the View matrix. Think of it as the location of the camera in the world. We then also build a Projection Matrix. You know how when you have two objects of the same size, but the farther away one looks smaller, that is what a projection matrix does mathematically. The alternative to have an orthographic camera, think like how blueprints are always their exact size.

Finally to put these all together if we take our Model matrix, our View matrix, and our Projection matrix we have what is called an MVP (Model/View/Projection). These are super important in order to place objects around in 3D space. A different way to think about a camera is that rather than moving our camera around in the 3D world, we move everything else in the world around the camera by multiplying them by our MVP matrixes. Pretty neat!

## Anatomy of a 3D model

There are multiple formats of how to store 3D models. A popular one, and what we will focus on here, is glTF. It is considered a distribution format so is ideal for loading in a game. They store a ton of information and can be quite daunting at first glance. But once you understand the terminology and principles they are easy to understand. Here is a cheatsheet on the glTF format.

![glTF Cheatsheet](https://github.com/KhronosGroup/glTF/blob/main/specification/2.0/figures/gltfOverview-2.0.0d.png?raw=true)

We only care about a handful of items in this model.

- Node: This is a grouping in the model. This will contain a transform, along with a mesh. Think of these as objects.
- Mesh: This is a collection of vertices/indices/normals as well as a materialIndex. It is the actual geometry we think of in a mesh.
- Material: This is how we can color the geometry data. Typically following the PBR workflow. This will contain a list of reference textures that define the physical characteristics for rendering.
- Texture: Defines a 2D image and properties related to it.

This is just a simplification of these concepts but is already quite complicated to understand.

## Deferred Rendering

---

In modern graphics programming it is quite useful to use multiple pipelines chained together, rather than having one massive pipeline. One common way of doing this is called a Deferred Rendering Pipeline. In this system we will often split geometry tasks and lighting tasks into separate pipelines. First lets talk about the Geometry Pipeline.

## Geometry Pipeline

The geometry pipeline will take each of our 3D models and draw their data into multiple images skewed by our camera. For example we may loop over every mesh and write their Albedo (plain color) into an image. Same with their Normals texture, etc. We have not added these up into a final render, they are still plain data images. This pattern is typically called a GBuffer because we are creating a buffer of Geometry data which future pipelines can then use in their calculations. Here is an example GBuffer data structure.

```Typescript
export type GBufferImage = {
	view: GPUTextureView;
	texture: GPUTexture;
};

export const GeometryData: {
	pipeline: GPURenderPipeline;
	uboGroup: GPUBindGroup;
	gbufferGroup: GPUBindGroup;
	sampler: GPUSampler;
	depth: GBufferImage;
	materialGroupLayout: GPUBindGroupLayout;
	materialFactorsGroupLayout: GPUBindGroupLayout;
	uboGroupLayout: GPUBindGroupLayout;
	GBuffer: {
		albedo: GBufferImage;
		normal: GBufferImage;
		emissive: GBufferImage;
		metalicRoughnessAO: GBufferImage;
	};
	ubo: GPUBuffer;
};

```

There is a lot of data declared in there, most of it unrelated to our GBuffer but we will get to them shortly. Something to keep in mind with images in WebGPU is the concept of a Sampler/TextureView. Think of those like the rules on how to read data from the texture. For example we might scale this texture very small. Or we might have clamping rules so if we try to read a pixel wider than our texture we wrap vs max.

In our GBuffer we declare 4 textures, albedo, normal, emissive, and metalicRoughnessAO (ambient occlusion). These might not make sense right now but just know they are needed for the PBR (Physically Based Rendering) workflow.

## Lighting Pipeline

Next step in our workflow is the Lighting Pipeline. This pipeline is focused on Physically Based Rendering (PBR). Where our geometry pipeline does a draw call per model, our lighting pipeline does a draw call or each light. We also blend each call additively over top each other. We use sample our GBuffers here to calculate what stuff should be shiny/specular and what should appear diffused.

In the past you may have made a custom shader per material. For example a wood shader or a water shader etc. This is quite time consuming and is really hard to manage when you get into very complicated materials. Thus the PBR workflow was born. In essence this is a generalization for most materials in the world based on metalic/roughness. It has become a defacto standard for models in the industry although more specialized ideas do still exist. Sometimes this PBR shader will be referred to as an uber shader because it will be very complicated to take into account all of this physics we are introducing. Take a look at the lighting.frag.wgsl in the repo for an example.

Something else to note about this are the different types of lights.

- Directional Light: This is like the sun. They cover everything and have a direction to them.
- Point Light: These have a distance to them where beyond which the light doesn't hit. They can be thought of as a 3D gradient in space.
- Spot Light: Where a point light is completely spherical a spot light has a direction and an angle to them. Think like a flashlight.
- Area Light: Like a directional light but bound to a specific geometry, typically a rectangle.

## Composite Pipeline

Lastly we have the composite pipeline. This pipeline is where we stitch together the results of other pipelines into our final image. In this example it is very basic, just rendering the lighting results. In more advanced cases though we may need to layer multiple results on top of each other. We can also do Post-Processing tasks like Bloom/Film Grain/etc here.

## Other Pipelines

Those three are the basis of any graphics pipeline but is just the beginning. Here are some other pipelines you might have.

**Skybox:** Draws a cubemap skybox anywhere scene geometry isn't. Also typically will use IBL (Imaged Based Lighting) to light objects in the scene from ambient light.

**UI:** Often you will use an Immediate Mode UI framework or other tools to draw flat HUB/UI elements. This would then be layered on top of the final results.

**GI/Indirect:** Global Illumination often can use multiple pipelines and is about creating bounce lighting, think how a red ball in a bright white room will make the walls look slightly red as well. Often this uses a compute pipeline which generates Light Probes using Spherical Harmonics. You would then have an Indirect pipeline which uses those pre-computed probes to light scene models.

**ShadowMaps:** If you want shadows the standard way to do so would be to calculate shadow maps. These are a cubemap for each light in your scene. This cubemap is multiple depth textures from the lights perspective in the scene.

**Volumetric:** If you want clouds or complex fog you might use a volumetric pipeline to calculate them.

**SSAO:** Screen-Space Ambient Occlusion is a technique to darken cracks/corners where light gets trapped.

## Conclusion

---

That is a lot of information all at once... This is not a comprehensive guide but more as a collection of topics as a spring board to then dive deeper into. We also only covered the rendering pipeline and not the engine architecture. Deferred rendering is also just one way of doing things, Forward Rendering is an alternative that is also popular. We also didn't talk about Ray Tracing at all which many of these topics will have a Ray Tracing based alternative. WebGPU is a great way to experiment with rendering techniques. Many concepts carry over to Vulkan or other modern APIs but you don't have to worry about memory management or other complicated house keeping tasks.
