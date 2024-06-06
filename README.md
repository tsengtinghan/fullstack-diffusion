# AI visual vocabulary builder
## Description
This is a web application that helps you to learn new words by generating images based on the word you want to learn. The images are generated by a sdxl, which is a diffusion-based model that can generate images from textual descriptions. The word definition and example sentence is generate by gpt3.5

## to-do list
- [] when image generation finish, call cloundinary api and upload the image, get the id and store the id into the database
- [] when db finish storing, refetch wordlist on the client side
- [] imporve image generation prompt (and model choice?)
- [] loading image
- [] flash card style
- [] migrate to oxford dictionary api to save $$
