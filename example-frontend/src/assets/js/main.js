import $ from 'jquery';
import { putUser, getUsers } from './api';

getUsers().then((response) => {
  if (response.ok) {
    const data = response.data;

    data.users.forEach(user => (
      $('.users').append(`<p>Username: <strong>${user.username}</strong></p>`)
    ));
  }
});

$('#createuser').submit(function (event) {
  event.preventDefault();

  const username = $(this).find(':input:nth-child(1)').val();
  const password = $(this).find(':input:nth-child(2)').val();

  putUser(username, password).then((response) => {
    if (!response.ok) {
      // eslint-disable-next-line
      return alert('this user already exists');
    }

    return $('.users').append(`<p>Username: <strong>${response.data.user.username}</strong></p>`);
  });
});
