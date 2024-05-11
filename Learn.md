# Learn.md - Local Project Build Guide

## Introduction
Welcome to our project! Our project is an ONDC (Open Network for Digital Commerce) site integrated with OpenStreetMap, designed to provide a seamless digital commerce experience for businesses and consumers across Bharat. By leveraging ONDC APIs for data exchange and integrating with OpenStreetMap for location-based services, our platform aims to revolutionize digital commerce accessibility and efficiency.

## Prerequisites
Before you proceed with building the project locally, ensure you have the following prerequisites installed on your machine:
- **Git**: Version control system for cloning the project repository.
- **Node.js and npm (Node Package Manager)**: JavaScript runtime environment and package manager for installing project dependencies.
- **Node version**: Currently used node version v20.11.1
  
## Step-by-step Guide
1. **Clone the Repository:**
   - Open your terminal or command prompt.
   - Clone the project repository to your local machine using the following command:
     ```
     git clone <repository_link>
     ```

2. **Navigate to the Project Directory:**
   - Change your current directory to the cloned project directory:
     ```
     cd <e-commerce_website>
     ```

3. **Install Dependencies:**
   - Once inside the project directory, install the required dependencies by executing:
     ```
     npm install
     ```

4. **Build the Application:**
   - After installing dependencies, build the application to prepare it for deployment:
     ```
     npm run build
     ```
   - This command compiles and bundles the frontend assets and prepares the project for deployment.

5. **Start the Development Server:**
   - Once the build process is complete, start the development server with the following command:
     ```
     npm start
     ```
   - This command launches a local server to host the application.

6. **Access the Application:**
   - After the server starts successfully, access the application by opening a web browser and navigating to the provided URL.
   - Explore the various digital commerce services and features offered by the platform.
   - Utilize the integrated OpenStreetMap for location-based services to enhance your user experience.

## Creating a Pull Request
To contribute to the project, follow these steps to create a pull request:
1. **Create a Branch:**
   - Before making any changes, create a new branch with a name related to the issue you're addressing. Ensure the branch name follows the convention: `feature/issue-description-#issue_number`.

2. **Make Changes:**
   - Implement your changes or fixes in the newly created branch.

3. **Commit Changes:**
   - Commit your changes to the branch with descriptive commit messages.

4. **Push Changes:**
   - Push your changes to the remote repository using:
     ```
     git push origin branch-name
     ```

5. **Create Pull Request:**
   - Visit the repository on GitHub and navigate to the "Pull Requests" tab.
   - Click on "New Pull Request" and select your branch as the compare branch.
   - Provide a descriptive title and summary of your changes in the pull request description.
   - Submit the pull request for review.

## Conclusion
Congratulations! You have successfully built and started the project locally on your machine. We appreciate your interest and effort in exploring our project. Should you have any questions or encounter any issues during the build process, feel free to reach out to our team for assistance.

Thank you for your participation, and we encourage you to continue exploring and contributing to our project!

