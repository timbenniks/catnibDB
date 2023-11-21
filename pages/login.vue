<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { validateEmail } from "../lib/helpers";

definePageMeta({
  layout: "meta",
});

const supabase = useSupabaseClient();

const state = reactive({
  email: "",
});

const loginError = ref(false);
const loginSuccess = ref(false);

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) {
    errors.push({ path: "email", message: "Required" });
  }

  if (!validateEmail(state.email)) {
    errors.push({ path: "email", message: "This is not a valid email" });
  }

  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  const { error } = await supabase.auth.signInWithOtp({
    email: state.email,
    options: {
      emailRedirectTo: "http://localhost:3000/confirm",
    },
  });

  if (error) {
    loginError.value = true;
    loginSuccess.value = false;
  } else {
    loginSuccess.value = true;
    loginError.value = false;
  }
}

const user = useSupabaseUser();
watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/");
    }
  },
  { immediate: true }
);
</script>

<template>
  <UContainer :ui="{ constrained: 'max-w-xl' }">
    <img src="/chats.svg" class="w-20 my-5 mx-auto" />
    <UCard class="mt-10">
      <template #header>
        <div class="flex justify-between">
          <h1 class="font-bold text-xl">Log in</h1>
          <UColorModeButton />
        </div>
      </template>

      <section>
        <UForm
          v-if="!loginError && !loginSuccess"
          :validate="validate"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormGroup label="Email" name="email" v-slot="{ error }">
            <UInput
              v-model="state.email"
              type="email"
              placeholder="Enter email"
              :icon="
                error
                  ? 'i-heroicons-exclamation-triangle-20-solid'
                  : 'i-heroicons-envelope'
              "
            />
          </UFormGroup>

          <UButton type="submit"> Submit </UButton>
        </UForm>
        <UAlert
          v-if="loginError"
          color="red"
          variant="subtle"
          icon="i-heroicons-exclamation-triangle-20-solid"
          title="There was an error"
          description="Please reload this page to try again."
        />
        <UAlert
          v-if="loginSuccess"
          color="green"
          variant="subtle"
          icon="i-heroicons-check-badge"
          title="Check your email"
          description="A magic login link has been send to your email address."
        />
      </section>
    </UCard>
  </UContainer>
</template>
