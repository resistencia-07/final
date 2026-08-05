You are a Senior Frontend Architect, Senior UI/UX Designer, Senior React + TypeScript Engineer and Product Designer.

Your task is to build a PREMIUM production-quality frontend application for a sports analytics system called "NDURANCE".

==========================================================
PROJECT
==========================================================

Project Name:
NDURANCE

Purpose:
A premium sports performance analytics application used by coaches to analyse athletes running on a treadmill using three USB cameras.

The application should feel like an Apple WWDC 2026 product.

This is NOT a college-looking project.

The UI should feel like:

• Apple WWDC 2026 Liquid Glass
• VisionOS
• Apple Fitness
• Luxury minimal interface
• Glassmorphism
• Smooth animations
• Premium typography
• Spacious layouts
• Professional Sports Lab

==========================================================
IMPORTANT
==========================================================

DO NOT CREATE BACKEND.

DO NOT CREATE DATABASE.

Instead,

Design every frontend module in a backend-friendly way.

Everything should be easy for backend developers to connect.

Create

✔ clean interfaces
✔ reusable services
✔ API folders
✔ models
✔ types
✔ placeholders
✔ mock data
✔ axios service structure

Every API should be abstracted.

Never hardcode backend logic.

Use TODO comments like

// TODO: Backend API

or

// Backend Integration Point

==========================================================
TECH STACK
==========================================================

React
TypeScript
Vite

TailwindCSS

Framer Motion

Axios

TanStack React Query

React Router

React Hook Form

Zod Validation

Lucide React

Shadcn UI

Radix UI

DaisyUI (only if needed)

Three.js (only if useful)

GSAP (optional)

NO REDUX unless absolutely necessary.

==========================================================
ARCHITECTURE
==========================================================

Use production folder architecture.

Example:

src/

app/

components/

features/

pages/

layouts/

services/

hooks/

context/

types/

constants/

utils/

animations/

assets/

api/

config/

routes/

styles/

==========================================================
CODE QUALITY
==========================================================

Keep code

Simple

Readable

Professional

Modular

Reusable

Maintainable

Backend Friendly

No unnecessary complexity.

Avoid giant files.

Split components.

Use reusable hooks.

==========================================================
THEME
==========================================================

Apple WWDC 2026 Liquid Glass

Glassmorphism

Luxury

Premium

Modern

Minimal

Elegant

Soft shadows

Blur

Rounded corners

Floating panels

Large spacing

Beautiful gradients

Smooth transitions

120 FPS feeling

No gaming UI.

No cyberpunk.

No neon overload.

==========================================================
COLOR PALETTE
==========================================================

Primary

#FF6B9D

Secondary

#8B5CF6

Accent

#38BDF8

Deep

#4C1D95

Background

#08090D

Text

#F5F5F7

Gray

#A1A1AA

Glass

rgba(255,255,255,0.12)

Border

rgba(255,255,255,0.20)

Blur

20px–30px

Radius

24px

==========================================================
APPLICATION FLOW
==========================================================

Login

↓

Dashboard

↓

Athlete Profile

↓

Session Preparation

↓

Start Test

↓

Countdown

↓

Camera Recording

↓

Developer Monitoring

↓

Stop Session

↓

Generate Report

==========================================================
AUTHENTICATION
==========================================================

JWT Authentication

Local Backend

Frontend only

Create:

Auth Context

Protected Routes

Axios interceptor

Access Token handling

Refresh Token placeholder

Login API placeholder

Signup API placeholder

Logout placeholder

==========================================================
LOGIN PAGE
==========================================================

Luxury Glass UI

Animated background

Floating gradient blobs

NDURANCE logo

Apple typography

Smooth page transition

Inputs

Username

Password

Remember me

Login

Signup

Forgot Password

==========================================================
SIGNUP
==========================================================

Step 1

Name

Email

Age

Gender

Weight

Height

Step 2

Password

Confirm Password

Beautiful step animation.

==========================================================
DASHBOARD
==========================================================

ONLY ONE ATHLETE.

Do NOT create multiple athlete management.

Show

Athlete Name

Running Illustration

Today's Date

Quick Start Button

Previous Session Card

Premium Statistics Cards

Glass Cards

Animated widgets

Minimal design.

==========================================================
SESSION PREPARATION PAGE
==========================================================

Before starting test

Show checklist

✓ Three Cameras Connected

✓ Secondary Display Connected

✓ Recording Ready

✓ Timer Ready

✓ Athlete Ready

Large Start Test button

When Start Test pressed

Begin countdown.

==========================================================
CAMERA SYSTEM
==========================================================

Three USB Cameras

NO LAPTOP WEBCAM

Camera Views

LEFT

BACK

RIGHT

Portrait

9:16

No cropping.

Fit screen.

==========================================================
SECOND DISPLAY
==========================================================

Automatically detect secondary monitor.

When connected

Move ENTIRE Camera View page to second display.

Laptop should stay on Developer View.

Second monitor shows ONLY

Camera Interface

No controls.

==========================================================
CAMERA PAGE
==========================================================

Three portrait camera cards.

Apple Glass panels.

Large spacing.

Beautiful shadows.

Top

NDURANCE logo

Center

3 Camera Views

Bottom

Minimal status

==========================================================
BACK CAMERA
==========================================================

Back Camera is the main camera.

Top Center

Show premium countdown

3

2

1

GO

After GO

Countdown becomes Stopwatch

Floating like Apple's Dynamic Island.

Large glass capsule.

Elegant animation.

==========================================================
RECORDING
==========================================================

Frontend should expose recording hooks.

Backend will control recording.

Create placeholders

startRecording()

stopRecording()

saveSession()

recordingState

No recording logic.

Only architecture.

==========================================================
DEVELOPER VIEW
==========================================================

Coach Screen

Show

Camera Detection

Secondary Display Status

Camera Switch Controls

Speed Input

Heart Rate Input

Steps Input

Elapsed Time

Stop Button

Recording Status

Connection Status

Keyboard shortcuts supported.

Simple.

Professional.

==========================================================
CAMERA SWITCH
==========================================================

Allow switching

Left

Back

Right

Without changing code.

Frontend only.

==========================================================
REPORT PAGE
==========================================================

Luxury report.

Cards

Charts

Statistics

Glass UI

Sections

Athlete Info

Running Metrics

Heart Rate

Speed

Steps

Camera Summary

Performance Summary

PDF Export button

==========================================================
AFTER STOP SESSION
==========================================================

Frontend calls backend.

Expected backend behaviour

Athletes/

Athlete Name/

Date/

report.pdf

left.mp4

back.mp4

right.mp4

session.json

Frontend should prepare request only.

==========================================================
PROFILE PAGE
==========================================================

Large profile image

Male/Female avatar

Athlete Information

Session Count

Line Chart

Running animation

Heart animation

Logout bottom left

==========================================================
API STRUCTURE
==========================================================

Create API services only.

Example

/auth

/session

/report

/profile

/camera

Every endpoint must be isolated.

Axios only.

==========================================================
STATE MANAGEMENT
==========================================================

Prefer

React Context

React Query

Hooks

Avoid unnecessary global state.

==========================================================
ANIMATIONS
==========================================================

Framer Motion

Smooth

Elegant

Apple style

No flashy animations.

==========================================================
RESPONSIVE
==========================================================

Desktop First

1920x1080

1440

Laptop

Tablet

==========================================================
ACCESSIBILITY
==========================================================

Keyboard navigation

ARIA labels

Good contrast

Readable typography

==========================================================
PERFORMANCE
==========================================================

Lazy loading

Memoization

Reusable components

Code splitting

Optimized rendering

==========================================================
CODING RULES
==========================================================

Never write messy code.

Never generate huge components.

Always separate files.

Always use interfaces.

Always use TypeScript types.

Comment backend integration points.

Write scalable architecture.

==========================================================
DESIGN GOAL
==========================================================

Every page should make the user think:

"This looks like software built by Apple for a professional sports laboratory."

Luxury.

Minimal.

Premium.

Fast.

Elegant.

Professional.

Build the complete frontend step-by-step, maintaining consistent architecture, reusable components, and backend-ready integration points without implementing the backend itself.