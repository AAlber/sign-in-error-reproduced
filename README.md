<div align="center">

# Fuxam

</div>

---

## Setup 🏗

### Doppler:
#### Mac:
- Run `yarn` or `npm install` to install dependencies
- Run `brew install gnupg` 
- Run `brew install dopplerhq/cli/doppler`
- Check doppler is running with `doppler --version`
- Create a new account on Doppler if you don't have one
- Ask to get added to Doppler workspace
- Login to Doppler `doppler login`
- cd into the /fuxam-web home directory and run `doppler setup`
- Select `dev_vars` and click enter

#### Windows:
- Download scoop if you don't have it already by running `npm install scoop`
- Run `scoop bucket add doppler https://github.com/DopplerHQ/scoop-doppler.git `
- Run `scoop install doppler`
- Check doppler is running with `doppler --version`
- Create a new account on Doppler if you don't have one
- Ask to get added to Doppler workspace
- Login to Doppler in your terminal `doppler login`
- cd into the /fuxam-web home directory and run `doppler setup`
- Select your environment and click enter

## Development 🚀

1.  Run `npm run prisma generate` to generate the prisma schema
2.  Run `npm i` to install all dependencies
3.  Run `npm run dev` to start the Client
