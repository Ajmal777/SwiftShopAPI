# <center> Swift Shop <center>

The Swift Shop API is a RESTful web service that allows users and sellers to interact with an online marketplace. The API provides the following routes for different functionalities:

-   <b>Users:</b> These routes allow users to create an account, log in, edit their profile, and delete their account. Users can also view cart and wishlist.
-   <b>Sellers:</b> These routes allow sellers to create an account, log in, edit their profile, and delete their account. Sellers can also manage their products and inventory.
-   <b>Products:</b> These routes allow users and sellers to perform various actions on products, such as uploading, deleting, editing, adding to cart, removing from cart, adding to wishlist, removing from wishlist, etc. Users can also view the details, ratings, and reviews of any product.
-   <b>Reviews:</b> These routes allow users to post, edit, and delete reviews on products. Users can also like, dislike, save, and unsave a product review, as well as see all the reviews of a product or a user.
-   <b>Comments:</b> These routes allow users to reply to reviews or comments. Users can also edit, delete, like, dislike, save, and unsave comments.

## Table of Content
<details>
<summary style="font-size: 16px; font-weight: 500;">User Routes</summary>

- #### [Register user](#register)
- #### [Login user](#login)
- #### [Edit user](#edit-profile)
- #### [Delete user](#delete-account)
</details>
<details>
<summary style="font-size: 16px; font-weight: 500;">Seller Routes</summary>

- #### [Register seller](#register-1)
- #### [Login seller](#login-1)
- #### [Edit seller](#edit-profile-1)
- #### [Delete seller](#delete-account-1)
</details>
<details>
<summary style="font-size: 16px; font-weight: 500;">Product Routes</summary>

- #### [Get / Filter products](#get-all-products--get-filtered-products)
- #### [Create product](#create-product-1)
- #### [Edit product](#edit-product-1)
- #### [Delete product](#delete-product-1)
- #### Cart
    - [Add to cart](#add-to-cart)
    - [Remove from cart](#remove-from-cart)
    - [Clear cart](#clear-cart)
- #### Wishlist
    - [Add to wishlist](#add-to-wishlist)
    - [Remove from wishlist](#remove-from-wishlist)
    - [Clear wishlist](#clear-wishlist)
</details>
<details>
<summary style="font-size: 16px; font-weight: 500;">Review Routes</summary>

- #### [Create review](#create-review-1)
- #### [Edit review](#edit-review-1)
- #### [Delete review](#delete-review-1)
- #### Like / Dislike
    - [Like](#like)
    - [Undo Like](#undo-like)
    - [Dislike](#dislike)
    - [Undo Dislike](#undo-dislike)
- #### Save
    - [Save review](#save-2)
    - [Unsave review](#unsave)
- #### Get reviews
    - [Get product reviews](#get-product-reviews)
    - [Get user reviews](#get-user-reviews)
</details>
<details>
<summary style="font-size: 16px; font-weight: 500;">Comment Routes</summary>

- #### [Reply](#reply-1)
- #### [Edit comment](#edit)
- #### Like / Dislike
    - [Like](#like-1)
    - [Undo Like](#undo-like-1)
    - [Dislike](#dislike-1)
    - [Undo Dislike](#undo-dislike-1)
- #### Save
    - [Save comment](#save-3)
    - [Unsave comment](#unsave-1)
</details>

## Getting started
Before starting the server, run the following commands in your CLI:
```js
npm install
```
To start the server:
```js
node index.js
```

## Environment variables required:
Create a ``.env`` file and add these variables in it before starting the server.
- <b>PORT</b> : ``Number`` : Port number of your application.
- <b>BCRYPT_SALT</b> : ``Number`` : Required for password encryption.
- <b>JWT_SECRET_KEY</b> : ``String`` : Required to verify JWT token.
- <b>DB_URI</b> : ``String`` : Your MongoDB connection string.

# <center style="font-size: 32px; font-weight: 600;"> User Routes </center>

## Register

```js
POST /users/register

{
    name: "John Doe",
    userName: "johndoe123",
    email: "john.doe@example.com",
    password: "securePassword123",
    userProfileImg: "https://example.com/profile-picture.jpg"
}
```

Note: <b>userProfileImg</b> is optional

## Login

```js
POST /users/login

{
    email: "john.doe@example.com",
    password: "securePassword123",
}
```

## Edit Profile

```js
PUT /users/edit

{
    password: "updatedPassword456",
    userProfileImg: "https://example.com/new-profile-picture.jpg"
    /* other user data */
}
```

## Delete Account
```js
DELETE /users/delete
```


# <center style="font-size: 32px; font-weight: 600;"> Seller Routes </center>

## Register
```js
POST /seller/register

{
    name: "Alice Johnson",
    sellerName: "WonderfulGoods",
    email: "alice.johnson@example.com",
    password: "secureSeller123",
    about: "Passionate about offering high-quality products to customers.",
    sellerProfileImg: "https://example.com/seller-profile-pic.jpg"
}
```
Note: <b>about</b> and <b>sellerProfileImg</b> are optional.

##  Login
```js
POST /seller/login

{
    email: "alice.johnson@example.com",
    password: "secureSeller123",
}
```

## Edit Profile
```js
PUT /seller/edit

{
    password: "updatedSellerPwd789",
    about: "Dedicated to providing unique and affordable items.",
    sellerProfileImg: "https://example.com/updated-seller-profile.jpg"
    /* other seller data */
}
```

## Delete Account
```js
DELETE /seller/delete
```

# <center style="font-size: 32px; font-weight: 600;"> Product Routes </center>

## Get all products / Get filtered products

```js
GET /product?query="macbook"&page=2&perPage=10

{
    price: {
        minPrice: 499,
        maxPrice: 1000
    },
    rating: 4
}
```
<b>Note:</b>
- Default value for <b>perPage</b> is 5. 
- All queries and body fields are <b>optional</b>.
- Not passing any query or body, will return <b>all</b> products by default.

## Create product
```js
POST /product/create

{
    product_name: "Smartphone X",
    product_desc: "High-performance smartphone with advanced features.",
    product_price: 499,
    stock: 50,
    product_category: "Electronics",
    product_images: ["https://example.com/product-image1.jpg", "https://example.com/product-image2.jpg"]
}
```

## Edit product
```js
PUT /product/update/:productId

{
    product_desc: "Cutting-edge smartphone with enhanced features for tech enthusiasts.",
    product_price: 549,
    stock: 60
    /* other product data */
}
```

## Delete product
```js
DELETE /product/delete/:productId
```

<b>Note: </b> Create product, Edit product and Delete product are only accessible to <b>seller</b>.

## Cart
- ### Add to cart
    ```js
    POST /product/cart/:productId
    ```
- ### Remove from cart
    ```js
    DELETE /product/cart/:productId
    ```
- ### Clear cart
    ```js
    DELETE /product/cart
    ```
## Wishlist
- ### Add to wishlist
    ```js
    POST /product/wishlist/:productId
    ```
- ### Remove from wishlist
    ```js
    DELETE /product/wishlist/:productId
    ```
- ### Clear wishlist
    ```js
    DELETE /product/wishlist
    ```
# <center style="font-size: 32px; font-weight: 600;"> Review Routes </center>

## Create review
```js
POST /review/:productId

{
    rating: 4.5,
    title: "Impressive Product!",
    body: "I've been using this smartphone for a month, and it exceeds my expectations. The performance is outstanding. Highly recommended!",
}
```

## Edit review
```js
PUT /review/:reviewId

{
    rating: 5.0,
    title: "Exceptional Experience!",
    body: "After using this smartphone for several months, I am still amazed by its performance. Definitely the best purchase I've made!",
}
```
<b>Note: </b> All fields are optional.

## Delete review
```js
DELETE /review/:reviewId
```

## Like / Dislike
- ### Like
    ```js
    POST review/like/:reviewId
    ```
- ### Undo Like 
    When the user accidentaly likes a review, this can be used to undo like
    ```js
    DELETE review/like/:reviewId
    ```
- ### Dislike
    ```js
    POST review/dislike/:reviewId
    ```
- ### Undo dislike
    When the user accidentaly dislikes a review, this can be used to undo dislike
    ```js
    DELETE review/dislike/:reviewId
    ```
## Save routes
- ### Save 
    ```js
    POST review/save/:reviewId
    ```
- ### UnSave
    ```js
    DELETE review/save/:reviewId
    ```
## Get Reviews
- ### Get product reviews
    This route is used to fetch all reviews made on a product.
    ```js
    GET review/:productId/product
    ```
- ### Get user reviews
    This route is used to fetch all reviews made by a user.
    ```js
    GET review/:userId/user
    ```

# <center style="font-size: 32px; font-weight: 600;"> Comment Routes </center>

## Reply
This route can be used to reply to product<b> review</b> or a <b>comment</b>. Nested comments is possible in this.
```js
POST comment/reply

{
    comment: "Totally agree with your review! The camera quality is outstanding.",
    parentCommentId: "xyz789" ,
    reviewId: "abc123"
}
```
<b>Note: </b>
- Only <b>One ID</b> must be used.
- If both <b>reviewId</b> and <b>parentCommentId</b> are present at the same time, only <b>parentCommentId</b> will be considered.
- When replying to a <b>Review</b>, use <b>reviewId</b>. 
- When replying to a <b>Comment</b>, use <b>parentCommentId</b>.

## Edit
```js
PUT comment/edit

{
    commentId: "def456",
    text: "Some updated comment here."
}
```

## Like / Dislike
- ### Like 
    ```js
    POST comment/like/:commentId
    ```
- ### Undo Like
    Used to undo like when the user accidently likes the comment.
    ```js
    DELETE comment/like/:commentId
    ```
- ### Dislike
    ```js
    POST comment/dislike/:commentId
    ```
- ### Undo Dislike
    Used to undo dislike when the user accidently dislikes the comment.
    ```js
    DELETE comment/dislike/:commentId
    ```
## Save routes
- ### Save
    ```js
    POST comment/save/:commentId
    ```
- ### UnSave
    ```js
    DELETE comment/save/:commentId
    ```