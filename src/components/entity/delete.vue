<!--
Copyright 2024 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/getodk/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
-->
<template>
  <modal id="entity-delete" :state="state" :hideable="!awaitingResponse"
    backdrop @hide="$emit('hide')" @shown="focusCheckbox">
    <template #title>{{ $t('title', { label }) }}</template>
    <template #body>
      <p class="modal-introduction">
        <span>{{ $t('introduction[0]', { label }) }}</span>
        <sentence-separator/>
        <span>{{ $t('common.noUndo') }}</span>
      </p>
      <form v-if="checkbox">
        <div class="checkbox">
          <label>
            <input ref="input" v-model="noConfirm" type="checkbox">
            {{ $t('field.noConfirm') }}
          </label>
        </div>
      </form>
      <div class="modal-actions">
        <button type="button" class="btn btn-danger"
          :aria-disabled="awaitingResponse" @click="del">
          {{ $t('action.delete') }} <spinner :state="awaitingResponse"/>
        </button>
        <button type="button" class="btn btn-link"
          :aria-disabled="awaitingResponse" @click="$emit('hide')">
          {{ $t('action.cancel') }}
        </button>
      </div>
    </template>
  </modal>
</template>

<script setup>
import { ref, watch } from 'vue';

import Modal from '../modal.vue';
import SentenceSeparator from '../sentence-separator.vue';
import Spinner from '../spinner.vue';

defineOptions({
  name: 'EntityDelete'
});
const props = defineProps({
  state: Boolean,
  checkbox: Boolean,
  label: {
    type: String,
    default: ''
  },
  awaitingResponse: Boolean
});
const emit = defineEmits(['hide', 'delete']);

const noConfirm = ref(false);
watch(() => props.state, (state) => { if (!state) noConfirm.value = false; });

const input = ref(null);
const focusCheckbox = () => { if (props.checkbox) input.value.focus(); };

const del = () => {
  if (props.checkbox)
    emit('delete', !noConfirm.value);
  else
    emit('delete');
};
</script>

<i18n lang="json5">
{
  "en": {
    // This is the title at the top of a pop-up. {label} is the label of an
    // Entity.
    "title": "Delete {label}",
    "introduction": [
      // {label} is the label of an Entity.
      "Are you sure you want to delete “{label}”?"
    ],
    "field": {
      "noConfirm": "Don’t ask again for now"
    }
  }
}
</i18n>
