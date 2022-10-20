<template>
  <div v-if="currentAdherent" class="edit-form">
    <h4>Adherent</h4>
    <form>
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" class="form-control" id="title"
          v-model="currentAdherent.title"
        />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <input type="text" class="form-control" id="description"
          v-model="currentAdherent.description"
        />
      </div>

      <div class="form-group">
        <label><strong>Status:</strong></label>
        {{ currentAdherent.published ? "Published" : "Pending" }}
      </div>
    </form>

    <button class="badge badge-primary mr-2"
      v-if="currentAdherent.published"
      @click="updatePublished(false)"
    >
      UnPublish
    </button>
    <button v-else class="badge badge-primary mr-2"
      @click="updatePublished(true)"
    >
      Publish
    </button>

    <button class="badge badge-danger mr-2"
      @click="deleteAdherent"
    >
      Delete
    </button>

    <button type="submit" class="badge badge-success"
      @click="updateAdherent"
    >
      Update
    </button>
    <p>{{ message }}</p>
  </div>

  <div v-else>
    <br />
    <p>Please click on a Adherent...</p>
  </div>
</template>

<script>
import AdherentDataService from "../services/AdherentDataService.js";

export default {
  name: "adherent-edit",
  data() {
    return {
      currentAdherent: null,
      message: ''
    };
  },
  methods: {
    getAdherent(id) {
      AdherentDataService.get(id)
        .then(response => {
          this.currentAdherent = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    updatePublished(status) {
      var data = {
        id: this.currentAdherent.id,
        title: this.currentAdherent.title,
        description: this.currentAdherent.description,
        published: status
      };

      AdherentDataService.update(this.currentAdherent.id, data)
        .then(response => {
          console.log(response.data);
          this.currentAdherent.published = status;
          this.message = 'The status was updated successfully!';
        })
        .catch(e => {
          console.log(e);
        });
    },

    updateAdherent() {
      AdherentDataService.update(this.currentAdherent.id, this.currentAdherent)
        .then(response => {
          console.log(response.data);
          this.message = 'The adherent was updated successfully!';
        })
        .catch(e => {
          console.log(e);
        });
    },

    deleteAdherent() {
      AdherentDataService.delete(this.currentAdherent.id)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "adherents" });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.message = '';
    this.getAdherent(this.$route.params.id);
  }
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>
