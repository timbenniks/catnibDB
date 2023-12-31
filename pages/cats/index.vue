<script setup lang="ts">
import {
  AisInstantSearch,
  AisSearchBox,
  AisHits,
  AisRefinementList,
  AisConfigure,
} from "vue-instantsearch/vue3/es";

import { history } from "instantsearch.js/es/lib/routers";
import { simple } from "instantsearch.js/es/lib/stateMappings";

const routing = {
  router: history(),
  stateMapping: simple(),
};

import { translateLabel } from "../lib/helpers";

const indexName = "libres_chats";
const algolia = useAlgoliaRef();

const columns = [
  {
    key: "name",
    label: "Nom",
  },
  {
    key: "color",
    label: "Color",
  },
  {
    key: "birth_date",
    label: "Birth Date",
  },
  {
    key: "adoption_date",
    label: "Adoption Date",
  },
  {
    key: "arrival_date",
    label: "Arrival Date",
  },
  {
    key: "weight",
    label: "Weight",
  },
  {
    key: "host_fam",
    label: "Famile d'accuil",
  },
  {
    key: "adoption_fam",
    label: "Famile Adoption",
  },
];

const selectedColumns = ref([...columns]);

function transformItems(items: any) {
  return items.map((item: any) => ({
    ...item,
    label: translateLabel(item.label),
  }));
}

function mapToTableRows(items: any) {
  return items.map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      color: item.color,
      birth_date: item.birth_date,
      adoption_date: item.adoption_date ? item.adoption_date : "-",
      arrival_date: item.arrival_date ? item.arrival_date : "-",
      weight: item.weights.length
        ? item.weights[item.weights.length - 1].weight_gr
        : "-",
      host_fam: item.host_family_id ? item.host_family_id.name : "-",
      adoption_fam: item.adoption_family_id
        ? item.adoption_family_id.name
        : "-",

      class: "bg-gray-50 dark:bg-gray-950",
    };
  });
}

function select(row: any) {
  navigateTo(`/cats/${row.id}`);
}
</script>

<template>
  <ais-instant-search
    :index-name="indexName"
    :search-client="algolia"
    :routing="routing"
  >
    <ais-configure :hitsPerPage="100" />
    <UPage :ui="{ wrapper: 'max-w-full', left: 'pl-8' }">
      <template #left>
        <UAside>
          <h3 class="font-bold mb-2">Status</h3>
          <ais-refinement-list
            attribute="facets"
            operator="and"
            :transform-items="transformItems"
            :sort-by="['name:asc']"
          >
            <template v-slot:item="{ item, refine }">
              <UCheckbox
                color="primary"
                :checked="item.isRefined"
                :model-value="item.value"
                @change="refine(item.value)"
                :ui="{ wrapper: 'mb-1' }"
              >
                <template #label>
                  <span class="space-x-2">
                    <span>{{ item.label }}</span>
                    <UBadge
                      variant="subtle"
                      size="xs"
                      :ui="{ rounded: 'rounded-full' }"
                    >
                      {{ item.count }}
                    </UBadge>
                  </span>
                </template>
              </UCheckbox>
            </template>
          </ais-refinement-list>

          <UDivider type="solid" class="my-6" />

          <h3 class="font-bold mb-2">Famile d'accuil</h3>
          <ais-refinement-list attribute="host_family_id.name">
            <template v-slot:item="{ item, refine }">
              <UCheckbox
                color="primary"
                :checked="item.isRefined"
                :model-value="item.value"
                @change="refine(item.value)"
                :ui="{ wrapper: 'mb-1' }"
              >
                <template #label>
                  <span class="space-x-2">
                    <span>{{ item.label }}</span>
                    <UBadge
                      variant="subtle"
                      size="xs"
                      :ui="{ rounded: 'rounded-full' }"
                    >
                      {{ item.count }}
                    </UBadge>
                  </span>
                </template>
              </UCheckbox>
            </template>
          </ais-refinement-list>

          <UDivider type="solid" class="my-6" />

          <h3 class="font-bold mb-2">Famile d'adoption</h3>
          <ais-refinement-list attribute="adoption_family_id.name">
            <template v-slot:item="{ item, refine }">
              <UCheckbox
                color="primary"
                :checked="item.isRefined"
                :model-value="item.value"
                @change="refine(item.value)"
                :ui="{ wrapper: 'mb-1' }"
              >
                <template #label>
                  <span class="space-x-2">
                    <span>{{ item.label }}</span>
                    <UBadge
                      variant="subtle"
                      size="xs"
                      :ui="{ rounded: 'rounded-full' }"
                    >
                      {{ item.count }}
                    </UBadge>
                  </span>
                </template>
              </UCheckbox>
            </template>
          </ais-refinement-list>

          <UDivider type="solid" class="my-6" />

          <h3 class="font-bold mb-2">Sexe</h3>
          <ais-refinement-list attribute="sex">
            <template v-slot:item="{ item, refine }">
              <UCheckbox
                color="primary"
                :checked="item.isRefined"
                :model-value="item.value"
                @change="refine(item.value)"
                :ui="{ wrapper: 'mb-1' }"
              >
                <template #label>
                  <span class="space-x-2">
                    <span>{{ item.label }}</span>
                    <UBadge
                      variant="subtle"
                      size="xs"
                      :ui="{ rounded: 'rounded-full' }"
                    >
                      {{ item.count }}
                    </UBadge>
                  </span>
                </template>
              </UCheckbox>
            </template>
          </ais-refinement-list>
        </UAside>
      </template>
      <UPageBody>
        <ais-hits>
          <template v-slot="{ items }">
            <div class="flex justify-between pr-4 mb-8">
              <div class="flex gap-4">
                <UButton
                  icon="i-heroicons-pencil-square"
                  size="sm"
                  color="primary"
                  variant="solid"
                  to="/cats/new"
                >
                  New Cat
                </UButton>
                <ais-search-box>
                  <template
                    v-slot="{ currentRefinement, isSearchStalled, refine }"
                  >
                    <UInput
                      type="search"
                      placeholder="Recherche chat"
                      icon="i-heroicons-magnifying-glass-20-solid"
                      :loading="isSearchStalled"
                      :modelValue="currentRefinement"
                      color="primary"
                      variant="outline"
                      @input="refine($event.currentTarget.value)"
                    />
                  </template>
                </ais-search-box>
              </div>
              <USelectMenu
                v-model="selectedColumns"
                :options="columns"
                multiple
                placeholder="Columns"
              />
            </div>

            <UTable
              :columns="selectedColumns"
              :rows="mapToTableRows(items)"
              @select="select"
            />
          </template>
        </ais-hits>
      </UPageBody>
    </UPage>
  </ais-instant-search>
</template>
