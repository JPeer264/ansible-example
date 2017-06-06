# ansible-example

> Ansible example to publish a basic frontend with a Node.js backend

## What does it do?

1. Connects to whatever is given in `./hosts`
1. Installs and setup `postgres`
1. Installs and setup `nginx`
1. Runs the Node.js application at the given `backend_entrypoint` variable via [forever](https://www.npmjs.com/package/forever)
1. Deploys the frontend on port `80` and `location /`

## Getting started

First make sure ansible is installed on your machine. [More Info](http://docs.ansible.com/ansible/intro_installation.html)

In this example the `example-frontend` and the `example-backend` are in the same folder, this should be avoided, so in "real life" a SCM should be used instead (e.g. via [ansible git module](http://docs.ansible.com/ansible/git_module.html).

Make sure all your configuration variables, in `./group_vars/web`, fits your requirements.

## Usage

```sh
$ ansible-playbook webapp.yml
```

## LICENSE

MIT © [Jan Peer Stöcklmair](https://www.jpeer.at)
