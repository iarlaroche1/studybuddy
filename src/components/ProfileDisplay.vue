<template>
    <div class="profile-display-top">
      <img class="profile-picture" alt="ProfilePic" :src="url" />
      
      <div class="username-year">
        <span id="name">Name: {{ fullName }}<br></span>
        <span id="year">Year: {{ year }}</span>
      </div>
      
      <div class="edit-button-div">
        <button class="edit-profile-button" @click="$emit('edit-profile')">
          Edit Profile
        </button>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'ProfileDisplay',
    props: {
      url: String,
      fullName: String,
      year: String
    }
  }
  </script>
  
  <style scoped>
  .profile-display-top {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    padding: 10px;
  }
  
  .profile-picture {
    height: 80px;
    width: 80px;
    border: 1px solid #000;
    padding: 2px;
  }
  
  .username-year {
    flex-grow: 1;
  }
  
  .edit-button-div {
    margin-left: auto;
  }
  
  .edit-profile-button {
    background-color: rgb(173, 7, 82);
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .edit-profile-button:hover {
    background-color: rgb(160, 6, 75);
  }
  </style>