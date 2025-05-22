## API Aces

# Roomies Radar

Welcome to **Roomies Radar** by the **API Aces** team! Roomies Radar is a comprehensive application designed to help users find compatible roommates based on their preferences and create property listings for shared accommodations.

## Table of Contents
- [Roomies Radar](#roomies-radar)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Domain Model](#domain-model)
    - [Main Entities:](#main-entities)
    - [Relationships:](#relationships)
- [Collaborated with](#collaborated-with)
- [Design Model](#design-model)
- [Commands to commit and push:](#commands-to-commit-and-push)
- [Pre-requisites](#pre-requisites)
  - [API Documentation](#api-documentation)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Running Test Users](#running-test-users)
- [🤝 Contributions](#-contributions)
  - [🔮 Features for next release](#-features-for-next-release)

## Overview
Roomies Radar provides a streamlined solution for finding the perfect roommate and listing shared accommodations. It leverages a robust domain model and an OpenAPI-defined RESTful API to handle user registration, login, profile management, and property listings.

- Roomies Radar is a web platform designed to simplify the process of finding and booking accommodation for international students.
- The website connects current students who have available accommodations with new or international students looking for a place to stay.
- Roomie Finder offers a streamlined, user-friendly interface where students can browse, list, and book accommodations based on their preferences and budget.

## Domain Model

The Roomies Radar project is designed using Domain-Driven Design (DDD) principles. Below are the main entities and relationships:

### Main Entities:
1. **User**: Represents the user of the application with details like name, email, phone number, and membership status.
2. **Profile**: Stores additional user information such as gender, age, education, preferences, and work experience.
3. **Preferences**: Defines roommate preferences, including gender, room type, and special requirements.
4. **WorkExperience**: Captures the user’s work history.
5. **Education**: Holds educational background details of the user.
6. **Post**: Represents a user-created post for finding roommates or listing properties.
7. **Listing**: Stores details of the property listing, including address, price, amenities, and availability.
8. **Address**: Defines the location details of a property.


### Relationships:
- A **Profile** belongs to a **User** and includes **WorkExperience**, **Preferences**, and **Education**.
- A **User** can create multiple **Posts** and be tagged in multiple posts.
- A **Post** has a **Listing**, and a **Listing** is located at an **Address**.


# Collaborated with
    ~ B Sai Kalyan                            ---         burra.sa@northeastern.edu
    ~ Chinnasurya Prasad Vulavala             ---         vulavala.c@northeastern.edu
    ~ Sai Lalith Pulluri                      ---          pulluri.sa@northeastern.edu
    ~ Tianrui Li                              ---          li.tianr@northeastern.edu


# Design Model

```mermaid
---
title: Roomies Radar
---

    classDiagram
        class User {
            +String name
            +String email
            +String phoneNumber
            +String userId PK
            +String password
            +Date dateOfCreation
            +Membership membership
        }

        class Membership {
            +String membershipId
            +Decimal cost
            +Date startDate
            +Date endDate
            +Boolean isActive
            +Payment payment
        }
 
        class Payment {
            +String paymentId
            +String userId
            +Decimal amount
            +String paymentMethod
            +PaymentStatus status
            +Date paymentDate
            +String transactionId
        }

        class Profile {
            +User user
            +Enum gender
            +String hometown
            +Number age
            +String course
            +String college
            +String primaryLanguage
            +String otherLanguage
            +String foodType
            +WorkExperience workExperience
            +String otherHabits
            +String[] hobbies
            +Preferences preferences
            +Education education
        }

        class Foodpreference {
            <<enumeration>>
            Veg, 
            NonVeg
        }
        class Gender {
            <<enumeration>>
            M,
            F
        }

        class SpotType {
            <<enumeration>>
            PRIVATE_HALL,
            PRIVATE_ROOM,
            SHARED_HALL,
            SHARED_ROOM
        }


        class Preferences {
            +SpotType spotType
            +Gender roommateGender
            +Foodpreference roommateFoodPreference
            +boolean drinking
            +boolean smoking
            +boolean petsAllowed
            +String anySpecialRequirements
        }
    
        class WorkExperience {
            +String companyName
            +String role
            +Tenure tenure
        }
    
        class Education {
            +String school
            +String degree
            +String fieldOfStudy
        }

        class Post {
            +String postId
            +User createdBy
            +List<User> taggedRoommates
            +Listing listing
            +Preferences preferences
        }
 
        class Listing {
            +String listingId
            +Address address
            +Decimal price
            +String description
            +Date availabilityDates
            +String[] photos
            +String[] amenities
            +Integer maxOccupants
            +Date createdDate
        }
 
        class Address {
            +String street
            +Number apartmentNumber
            +String city
            +String state
            +String postalCode
            +String country
        }

        class Chat {
            +String chatId
            +String user1Id
            +String user2Id
            +Message[] messages
            +Date createdDate
            +Date lastUpdated
        }

        class Message {
            +String messageId
            +String senderId
            +String content
            +Date timestamp
            +MessageStatus status 
        }

        class MessageStatus {
            <<enumeration>>
            delivered
            read
        }

        User "1" --> "0..1" Membership : has
        Membership "1" --> "1" Payment : linked to
        Payment "1" --> "1" User : belongs to
 
        User "1" --> "0..*" Chat : participates in
        Chat "1" --> "0..*" Message : contains
        Message "1" --> "1" User : sender
        Message "1" --> "1" MessageStatus : has

        Profile "1" --> "1" User : belongs to
        Profile "1" --> "1" WorkExperience : has
        Profile "1" --> "1" Preferences : has
        Profile "1" --> "1" Education : has

        User "1" --> "0..*" Post : creates
        User "*" --> "0..*" Post : taggedIn
        Post "1" --> "1" Listing : has
        Listing "1" --> "1" Address : located at
        Post "1" --> "1" Preferences : has


        Preferences "1"--> "1" SpotType : has
        Preferences "1"--> "1" Gender : roommateGender 
        Preferences "1"--> "1" Foodpreference : roommateFoodPreference



```


# Commands to commit and push:

- git init (Even there is an hidden files I have initializes just for best practice)

- git add .

- git add filename.extension (used to add separate files in the commit list)

- git commit -m "READEME"

- git push origin main


# Pre-requisites

- Just one windows or Linux or Mac OS system and little bit of knowledge about git commands.
- Use VsCode to create and write the code in html and css. This is the best IDE for most of the programming languages.
- Use extensions which are related to HTML, CSS, live server and more to finish your work faster.
- Install mermaidjs and swagger viewer extensions on your IDE


## API Documentation

The API documentation is available [here](./service/docs/bruno/openapi/) or can be explored directly using Swagger UI by visiting `/api-docs` on the running application.


## Features

- User Registration and Authentication
- Profile Management (including Preferences, Work Experience, Education)
- Roommate Matching based on Preferences
- Property Listings and Address Management
- In-app messaging between users


## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: ReactJS, TypeScript (TSX)
- **State Management**: Redux
- **Internationalization (i18n)**: For multi-language support in the UI
- **Database**: MongoDB
- **Version Control**: Git
- **API Documentation**: OpenAPI 3.0, Swagger UI
- **Mermaid.js**: For diagram visualization
- **API Integration**: Fugu API for communication and messaging functionality



## Running Test Users


User 1:
        email: testuser@gmail.com
        password: testuser@123
User 2:
        email: testuser2@gmail.com
        password: testuser2@1234




# 🤝 Contributions

Want to learn with our code by editing:

It's pretty straingforward :

<img align="left" alt="Java" width="30px" style="padding-right:10px;" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" />


```git clone <repository url>```



Install Dependencies:
    
    
    For Both Front-end & Backend:
    
        npm install

        
Run the Application:
    
    For Front-end:
    
        cd app
        npm run dev
    
    
    For Back-end:
    
        cd service
        npm run dev

        




## 🔮 Features for next release

* Implement an admin permission system to manage user access levels and control over certain platform features.
  
* 3D Frontend Design



