# Northcoders News API

**A Reddit style API using Express, PSQL and Knex**

Content is socially curated and promoted by site members through voting.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Step 1 - Prerequisites 

In order to use this project you'll need the following;

1. A code editor (I used VS code)
2. [PostgreSQL](https://www.postgresql.org/) 

## Step 2 - Set up your own version of the repo

Clone this repo;

```bash
git clone https://github.com/clo2202/nc-news

```

On GitHub create your own **public** repository for your project. **Make sure NOT to initialise it with a README or .gitignore.**

Next, you should hook your local version up to the newly created GitHub repo. Use the following terminal commands, making sure to check the git remotes with each step (`git remote -v`):

```bash
git remote remove origin

# This will prevent you from pushing to the original Northcoders' repo.
```

```bash
git remote add origin <YOUR-GITHUB-URL>

# This will add your GitHub location to your local git repository.
# You can confirm this by checking the new git remote.
```
Once you're in the repo, ensure you have downloaded all of the dependencies using the following command;

```bash
npm install

# This will download all the dependencies required to work with this project.
```

## Step 2 - Setting up your project

In this repo you have been provided with a knexfile. Make sure to add it to the `.gitignore` once you start pushing to your own repository. If you are on linux you will need to insert your postgres username and password into the knexfile.
