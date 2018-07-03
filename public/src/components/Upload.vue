<template>
  <v-app id="inspire">
    <photo-upload 
        :enableEdits="true"
        :photoDefault="defaultPhoto"
        buttonClass="btn btn-primary"
        :showMessages="true"
        @photo-submit="photo_upload"
        @photo-change="photo_changed"
        >
    </photo-upload>            
  </v-app>
</template>