# snaptext

This project transform your images into editable text effortlessly.

![Text from Image Generator](https://files.edgestore.dev/j26azsoyqh7n72m2/myPublicImages/_public/b4a5b7c5-45d2-469f-b97f-5616f57ef8cc.png)

## How it works

This project uses both [Vercel AI Sdk](https://sdk.vercel.ai) and [Claude](https://claude.ai) with streaming to transform your images into editable text effortlessly. Image input file is pass to a prompt, then sends it to the claude API, where vercel ai sdk helps in the streams the response back to the application.

## Running Locally

1. Clone the repository.
2. Create an account at [console.anthropic.com](https://console.anthropic.com/settings/keys) and add your API key under `ANTHROPIC_API_KEY` in your `.env`.
3. Run npm install to install dependencies.
4. Run the application with `npm run dev` and it will be available at `http://localhost:3000`.
