<template>
  <div class="list row">
    <div class="col-md-8"></div>
    <div class="col-md-6">
      <h4>Lista użytkowników</h4>
      <div>
        <b-table
          :items="users"
          :fields="columns"
          responsive="sm"
          ref="selectableTable"
        >
          <template v-slot:cell(active)="row">
            <b-badge v-if="row.item.active" variant="success">
              Aktywne
            </b-badge>
            <b-badge v-else variant="warning"> Nieaktywne </b-badge>
          </template>
          <template v-slot:cell(edit)="row">
            <b-button size="sm" @click="editUser(row.item)">Edytuj</b-button>
          </template>
          <template v-slot:cell(delete)="row">
            <b-button size="sm" @click="deleteUser(row.item)">Usuń</b-button>
          </template>
        </b-table>
      </div>
      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >
        {{ message }}
      </div>
    </div>
    <div>
      <b-modal
        id="modal-center"
        ref="my-modal"
        centered
        title="Edycja użytkownika"
        @hidden="closeModal"
        @ok="handleOk"
      >
        <div v-if="currentUser">
          <div>
            <label><strong>Użytkownik:</strong></label>
            {{ currentUser.username }}
          </div>
          <div>
            <input
              v-model="currentUser.email"
              v-validate="'required|email|max:50'"
              type="email"
              class="form-control"
              name="email"
            />
            <div v-if="submitted && errors.has('email')" class="alert-danger">
              {{ errors.first('email') }}
            </div>
          </div>
          <template>
            <div>
              <b-form-group label="Status konta" v-slot="{ ariaDescribedby }">
                <b-form-checkbox
                  v-model="currentUser.active"
                  :aria-describedby="ariaDescribedby"
                  name="some-radios"
                  value="true"
                  >Aktywne</b-form-checkbox
                >
              </b-form-group>
            </div>
          </template>
          <b-form-group label="Role użytkownika:" v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
              id="checkbox-group-1"
              v-model="selectedRoles"
              :options="options"
              :aria-describedby="ariaDescribedby"
              name="flavour-1"
            ></b-form-checkbox-group>
          </b-form-group>
        </div>
        <div v-else>
          <br />
          <p>Proszę wybrać użytkownika</p>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import UserService from '../services/user.service';
import RoleService from '../services/role.service';
import User from '../models/user';

export default {
  name: 'Admin',
  data() {
    return {
      modes: ['multi', 'single', 'range'],
      columns: [
        { key: 'userId', label: 'Id' },
        { key: 'username', label: 'Nazwa użytkownika' },
        { key: 'email', label: 'Email' },
        { key: 'active', label: 'Status konta' },
        { key: 'edit', label: 'Edycja' },
        { key: 'delete', label: 'Usuń' },
      ],
      options: [],
      users: [],
      roles: [],
      currentUser: new User(),
      currentIndex: -1,
      username: '',
      selectedRoles: [],
      message: '',
      submitted: false,
    };
  },
  methods: {
    editUser(user) {
      this.currentUser = new User(
        user.username,
        user.email,
        '',
        '',
        user.active,
        user.rolesDto
      );
      this.showModal();
    },
    deleteUser(user) {
      if (confirm('Czy na pewno chcesz usunąć użytkownika?')) {
        UserService.deleteByUserId(user.userId)
          .then(() => {
            this.message = 'Użytkownik usunięty';
            this.successful = true;
            setTimeout(() => {
              this.successful = false;
              this.message = '';
              //   this.clearUser();
            }, 2000);
            this.retrieveUsers();
          })
          .catch(() => {});
      }
    },
    retrieveUsers() {
      UserService.getAllUsers()
        .then((response) => {
          this.users = response.data;
        })
        .catch(() => {});
    },
    retrieveRoles() {
      RoleService.getRoles()
        .then((response) => {
          this.roles = response.data;
          this.roles.forEach((element) => {
            this.options.push({
              text: element.roleDescription,
              value: element,
            });
          });
        })
        .catch(() => {});
    },

    setOptions() {
      this.roles.forEach((element) => {
        this.options.push({
          text: element.roleDescription,
          element,
        });
      });
    },

    refreshList() {
      this.retrieveUsers();
      this.currentIndex = -1;
    },
    showModal() {
      this.$refs['my-modal'].show();
      this.currentUser.rolesDto.forEach((r) => {
        this.selectedRoles.push(r);
      });
    },
    closeModal() {
      this.$refs['my-modal'].hide();
      this.selectedRoles = [];
      this.retrieveUsers();
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.updateUser();
    },
    updateUser() {
      this.currentUser.rolesDto = this.selectedRoles;
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          UserService.updateUserProperties(this.currentUser).then(
            () => {
              this.message = 'Użytkownik zaktualizowany';
              this.successful = true;
              setTimeout(() => {
                this.successful = false;
                this.message = '';
                //   this.clearUser();
              }, 2000);
              this.closeModal();
            },
            (error) => {
              this.successful = false;
              if (error.response.data.status === 401)
                this.message = 'Niepoprawne hasło';
              else {
                this.message =
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString();
              }
            }
          );
        }
      });
    },
  },

  mounted() {
    this.retrieveUsers();
    this.retrieveRoles();
  },
};
</script>
