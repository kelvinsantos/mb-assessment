Asst. Manager – Full Stack Developer – Technical Assessment

# Project Name: MB NFT Marketplace

# Requirements

```
1. Smart contracts:
    [x] a. Develop and Deploy NFT smart contracts
    [x] b. The smart contracts should be able to mint NFT
        [x] i. Mint only valid certain duration (example between 7 Jan to 14 Jan 2023)
        [x] ii. Mint only once for each wallet and Receipt (refer to 3.i)
        [x] iii. The receipt will have to be store in smart contract state
        [x] iv. Only able to mint 5 NFT
        [x] v. The NFT should have metadata (name, description, image)
    [x] c. Script to deploy the smart contract
2. WebApp:
    [x] a. React app with any preferred React framework can be used
    [x] b. Web3 integration with web3.js or ether.js
    [x] c. Collect user input e.g. NRIC
    [x] d. Interact with Smart contract by Claim (mint) NFT with the connected wallet and Receipt (refer to 3.i)
    [x] e. The App should display the NFT image from NFT metadata
    [x] f. The necessary error handlings to be developed
3. API:
    [x] a. Golang API
    [x] b. Any preferred framework (example gin-gonic)
    [x] c. The API will collect National Registration Identity Card (NRIC) and wallet address from WebApp
    [x] d. POST API body: NRIC and wallet address
    [x] e. NRIC must be unique
    [x] f. Wallet address can only be associated with 1 NRIC
    [x] g. Store into RDBS (PostgreSQL, MySQL, etc) for the unique NRIC and wallet address
    [x] h. Provide the docker-compose.yaml script for the RDBS stack
    [x] i. POST API Response with a Receipt produce by encrypt or hash the API body, you
    [x] would need to explain why you choose one mechanism over the other (encrypt vs hash)

```

# Pre-requisite

-   Install Docker and Docker Compose
    -   https://docs.docker.com/desktop/install/mac-install/
-   Install Go
    -   https://gist.github.com/vsouza/77e6b20520d07652ed7d
-   Install NPM/Node
    -   It's recommended to use nvm so switching node versions can be easily attained (https://github.com/nvm-sh/nvm)
    -   Or you can also install using the default installation of node (https://nodejs.org/en/download/)
-   Yarn
    -   https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable
-   A running evm compatible chain (i.e. ganache)
    ```
    $ npm install -g ganache-cli
    $ ganache
    ```
-   Install metamask wallet (https://metamask.io/)
    -   Create a new wallet
    -   Navigate to metamask Settings > Networks > Add a network > Add network manually
        -   Network name: Localhost 8545
        -   New RPC URL: http://localhost:8545
        -   Chain ID: 1337
        -   Currency Symbol: ETH
    -   Import the account (generated from ganache) 0 and 1 private key into metamask

# Backend Local Setup

1. Copy .env.example to .env

    ```
    $ cd backend/
    $ cp .env.example .env
    // Then put environment variables values
    ```

2. Running PostgreSQL via docker-compose

    ```
    // This will spawn a new PostgreSQL server
    $ docker-compose up or docker-compose up -d
    ```

3. Running the backend server
    ```
    // This will setup and run everything including the creation of the tables into `postgres` database
    // The default port for this would be 3000. To access you can use http://localhost:3000
    // Please check the postman collections for the available endpoints
    $ make run-local
    ```

# Frontend Local Setup and Smart Contract Deployment

1. Copy .env.example to .env

    ```
    $ cd frontend/
    $ cp .env.example .env
    // Then put environment variables values
    ```

2. Installing project dependencies
   $ yarn install

3. Compile the smart contract
   $ yarn compile-contracts

4. Deploy the smart contract
   $ source .env && yarn deploy-contracts

5. Running the frontend server
   // The default port for this would be 8081. To access you can use http://localhost:8081
   // Please check the postman collections for the available endpoints
   $ yarn dev

# References

```
DB Framework:
https://gorm.io/docs/index.html

For the docker-compose.yaml script:
https://geshan.com.np/blog/2021/12/docker-postgres/

Difference between encrypting and hashing:
https://www.thesslstore.com/blog/difference-encryption-hashing-salting/#:~:text=The%20hash%20value%20is%20different,of%20data%20and%20altering%20it.

Golang rest framework:
https://gofiber.io/

For using encryption:
https://medium.com/insiderengineering/aes-encryption-and-decryption-in-golang-php-and-both-with-full-codes-ceb598a34f41

Why I use AES as encrpytion?
https://www.precisely.com/blog/data-security/aes-vs-des-encryption-standard-3des-tdea#:~:text=AES%20data%20encryption%20is%20a,56%2Dbit%20key%20of%20DES.

Where should we store aes keys?
https://security.stackexchange.com/questions/12332/where-to-store-a-server-side-encryption-key/12334#12334
```
