# Deployment Guide

This repository is set up for a single Render deployment:

- Frontend and backend run from one Render Web Service.
- GitHub Actions only runs checks.

## Single Link Setup

1. Create one Render Web Service from this repository or import the `render.yaml` blueprint.
2. Render will build the frontend and backend together using the `render.yaml` file.
3. Deployment uses the real `backend/.env` file from this repository.
4. The backend serves the built frontend from the same URL.

## What You Get

- One public Render URL for the app.
- API routes available under `/api` on the same domain.
- React routes handled by the backend server.
- A health endpoint at `/api/health`.

## GitHub Actions

The workflow in `.github/workflows/ci.yml` now only runs checks:

- Frontend lint and build.
- Backend JavaScript syntax validation.

## Manual Steps Required

1. Deploy the repo to Render using the Blueprint or a web service.
2. Make sure `backend/.env` has the correct production values before deploy.
3. Use the single Render URL for the app.