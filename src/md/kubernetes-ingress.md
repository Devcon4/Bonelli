# How to setup Kubernetes Ingress and why you need it.
---

## Introduction
There are a lot of facets to Kubernetes. It can feel like a never ending pit of concepts to learn. One of the first major concepts you mind run into is Ingress. I had a lot of questions when I first heard about it. What does Ingress mean? How do I set it up? Why do I care? Lets look over these questions and see if we can shed some light on the subject.

## High level
--
Before we start looking at code lets take a step back and understand the concept of k8s Ingress first. At a high level Ingress is how we connect external traffic to a service in the cluster. What does that actually mean?

## The problem
Most services we create are `ClusterIP` which means they don't have an external IP in the cluster, only an internal one. So how does a request actually hit our service? We might want to do some extra stuff to that request as well like add a TLS certificate, logging, etc. That would be a pain to manually implement in every app in the cluster. In a cloud environment a `LoadBalancer` service in the cluster might actually make a Load Balancer resource in your provider. For example in Azure this will create a `Azure Load Balancer` with it's associated costs. Ideally we should only need one of these and not create a new one for every app in the cluster.

## How Ingress fits in
To get around some of these problem it would be useful to setup a reverse-proxy in the cluster. This proxy could then have a `LoadBalancer` service to expose it to the internet. Then we could have it forward to each of our app services. It would also be nice if we could declare those forwarding rules as Kubernetes resources rather than a config file in our reverse-proxy pod. Well this is exactly what an `Ingress Controller` is! See it's not that hard to understand once you get past the buzz words.