<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-btn
          target="_blank"
          text
          @click="showFileChooser"
        >
          <span class="mr-2">上传图片</span>
          <v-icon>mdi-file-upload-outline</v-icon>
        </v-btn>
        <v-btn
          target="_blank"
          text
          @click="cropAndFetch"
        >
          <span class="mr-2">搜索</span>
          <v-icon>mdi-selection-search</v-icon>
        </v-btn>
        &nbsp;
        <v-select
          class="mr-2"
          :items="[5, 10, 20, 30, 50]"
          v-model="nResults"
          label="返回结果数目"
          hide-details
          single-line
        ></v-select>
      </div>
      
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container class="pa-6">
        <input
          ref="input"
          type="file"
          name="image"
          accept="image/*"
          style="display: none"
          @change="uploadImg"
        />

        <v-row>
          <div class="d-inline-flex pa-2 rounded-xl">
            <vue-cropper
              ref="cropper"
              :src="imgSrc"
              @
              style="width: 480px; height: 360px"
              preview=".preview"
            />
          </div>
          <div class="d-inline-flex pa-2 rounded-xl">
            <div style="width: 200px;">
              <p><v-icon>mdi-crop</v-icon><span class="ml-2">ROI预览</span></p>
              <div class="preview cropper-bg"/>
            </div>
          </div>
          
  
        </v-row>

        <v-row>
          <v-col
            v-for="item in results"
            :key="item[0]"
            class="d-flex child-flex"
            cols="4"
          >
            <v-img
              :src="`/api/img/` + item[1]"
              lazy-src="./assets/logo.png"
              aspect-ratio="1"
              class="grey lighten-2"
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
        </v-row>
      </v-container>
      <!-- <HelloWorld/> -->
      
      

    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import axios from 'axios'

export default {
  name: 'App',

  components: {
    // HelloWorld,
    VueCropper
  },

  data: () => ({
    imgSrc: require("./assets/initial.jpg"),
    imgName: 'initial.jpg',
    nResults: 10,
    results: []
  }),

  methods: {
    uploadImg(event) {
      const img = event.target.files[0]
      this.imgSrc = URL.createObjectURL(img);
      this.imgName = img.name;
      this.$refs.cropper.replace(this.imgSrc);
    },

    showFileChooser() {
      this.$refs.input.click();
    },

    cropAndFetch() {
      let that = this;
      this.$refs.cropper.getCroppedCanvas().toBlob(async function(blob) {
        const params = new FormData()
        params.append('file', blob, that.imgName)
        params.append('n_result', that.nResults)
        axios.post(
          "/api/query",
          params
        ).then((res) => {
          that.results = res.data.data;
        });
      });
    },
  }
};
</script>

<style>
.cropper-bg {
  background-repeat: repeat;
}
.preview {
  width: 100%;
  height: calc(372px * (9 / 16));
  overflow: hidden;
}
</style>