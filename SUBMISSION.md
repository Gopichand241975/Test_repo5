# Workbench — Devpost submission text

## Track
Open Innovation

## AWS Database used
Aurora PostgreSQL

## Short description (tagline)
A project log for hobbyist makers to track materials, costs, and progress on everything they build.

## Full description

Workbench is a project log built for hobbyist makers — woodworkers, knitters,
3D-printing tinkerers, and anyone else who loses track of how much a project
actually cost. Users sign up, log a project (title, category, status), and
add the materials that go into it with quantity and unit cost. Workbench
automatically totals the cost per project and across their whole bench.

**Why Aurora PostgreSQL:** the data is inherently relational — one user has
many projects, each project has many materials — so a relational database
with real joins and aggregates is a natural fit. The app uses a SQL view
(`project_costs`) that joins projects to their materials and aggregates
`SUM(quantity * unit_cost)` to power the dashboard's running totals, which
would be far more awkward to express in a non-relational store. Aurora
PostgreSQL gives that relational model production-grade durability and
scale without the operational overhead of managing Postgres ourselves.

**Stack:** Next.js (App Router) frontend deployed on Vercel, with Next.js
API routes connecting to Aurora PostgreSQL via a pooled `pg` connection.
Auth is email/password with bcrypt-hashed passwords and JWT session cookies.

## What it solves
Hobbyists frequently lose track of what a project actually cost them in
materials, which makes it hard to price finished work, decide whether a
hobby is sustainable, or just understand where their money goes. Workbench
gives them a lightweight, purpose-built place to log that instead of a
spreadsheet they'll abandon.
