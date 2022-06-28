# Proxmox port manager (website)

## Dependencies

- nodejs
- npm

## Setup

- 1. `git clone https://github.com/AwiZy63/proxmox-port-manager`

- 2. Open new terminal
  - (if you are in debian environment, you can install `screen` apt to keep api open in background)
  - 1. Go inside proxmox-port-manager/api folder
  - 2. Go inside proxmox-port-manager/config folder and rename `config.json.example` to `config.json` and setup your database & api environment.
  - 3. type : `npx sequelize-cli db:migrate`
  - 4. type : `npm start`

- 3. Open new terminal (again)
  - 1. Go inside proxmox-port-manager/portmanager folder
  - 2. Edit all 'localhost:3030' in axios requests if necessary
  - 3. Build website using `npm run build`
  - 4. Upload your proxmox-port-manager/portmanager/build content into your website directory
  
- 4. Enjoy

### Issues

If you have any issues or question about api or react app, open new issue in 'issues' page.

#### Copyrights - Royalty free - AwiZy63