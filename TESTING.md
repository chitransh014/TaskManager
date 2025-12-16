# How to Test Real-Time Collaboration

Since this is a collaborative app, the best way to test it is by simulating two different users interacting at the same time.

### Prerequisite
Ensure the application is running:
-   **Backend**: `npm run dev` (Port 5000)
-   **Frontend**: `npm run dev` (Port 5173)

### Step-by-Step Testing Guide

1.  **Open Two Browsers**:
    -   Open your main browser (e.g., Chrome) -> **Window A**.
    -   Open an **Incognito/Private** window (or a different browser like Edge/Firefox) -> **Window B**.
    -   *Tip: Arrange them side-by-side on your screen.*

2.  **Login as Two Different Users**:
    -   **Window A**: Register/Login as **"User A"** (e.g., `userA@test.com`).
    -   **Window B**: Register/Login as **"User B"** (e.g., `userB@test.com`).

3.  **Test 1: Live Task Creation & Assignment**:
    -   In **Window A**: Click `+` to create a new task.
    -   Fill in details and **Assign to "User B"**.
    -   Click "Create".
    -   **👀 Watch Window B**:
        -   You should instantly see a **Toast Notification**: *"You were assigned: [Task Title]"*.
        -   The task should appear in the "Assigned to Me" list immediately without refreshing.

4.  **Test 2: Live Status Updates**:
    -   In **Window B**: Find the task.
    -   Change the status dropdown from `To Do` to `In Progress`.
    -   **👀 Watch Window A**:
        -   You should see a **Toast Notification**: *"A task was updated"*.
        -   The status of that task in Window A should flip to `In Progress` instantly.

5.  **Test 3: Live Deletion**:
    -   In **Window A**: Click "Delete" on the task.
    -   **👀 Watch Window B**:
        -   The task should disappear from the list instantly.
        -   You should see a notification: *"A task was deleted"*.

### Troubleshooting
-   If you don't see updates, ensure both windows show `Socket connected` (you might check the console logs if you are technical, or just ensure the server is running).
-   Ensure you are using `localhost:5173` for both windows.
