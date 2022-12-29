const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/pattern-guiltless-jewel|https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/sassy-translucent-tractor|https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/tabby-buttercup-pyroraptor|https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/spotted-abstracted-fifth|https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/heavy-salty-tibia|https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/periwinkle-enormous-sassafras|https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/sudden-happy-cellar|https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/harmless-bald-entree|https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/sunny-full-attempt|https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/ethereal-cut-stocking|https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/noon-diagnostic-brace|https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/oasis-classic-wolfsbane|https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/alert-seed-produce|https://8ea7943d-3d54-4492-965c-f578c9cdb46a@api.glitch.com/git/flossy-famous-citrus`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();