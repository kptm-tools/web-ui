<template>
  <div class="table-vulnerabilities">
    <div class="row">
      <div class="col-2"></div>
      <div class="col-10">
        <div class="row">
          <div class="col-8 header-title">Vulnerabilities</div>
          <div class="col-4 header-title">Severity</div>
        </div>
      </div>
    </div>
    <template
      v-for="vulnerability in vulnerabilitiesList"
      :key="vulnerability.id"
    >
      <div class="row">
        <div class="col-2 number flex items-center justify-center">
          {{ vulnerability.id + 1 }}
        </div>
        <div class="col-10 q-px-md data-table">
          <div class="row">
            <div class="col-8 flex items-center name">
              {{ vulnerability.name }}
            </div>
            <div class="col-4">
              <severity-chip :severity="{ critical: vulnerability.count }" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { SeverityKey, SeverityPerType } from 'src/models/scans.model';
  import { onMounted, PropType, ref, Ref } from 'vue';
  import SeverityChip from 'src/components/shared/SeverityChip.vue';

  const vulnerabilitiesList: Ref<
    { id: number; name: string; count: number }[]
  > = ref([]);

  const props = defineProps({
    vulnerabilities: {
      type: Object as PropType<SeverityPerType>,
      required: true
    }
  });

  onMounted(() => {
    Object.keys(props.vulnerabilities).forEach((key, index) => {
      const severityKey = key as SeverityKey;
      vulnerabilitiesList.value.push({
        id: index,
        name: severityKey,
        count: props.vulnerabilities[severityKey]
      });
    });
  });
</script>

<style scoped lang="scss">
  .table-vulnerabilities {
    .header-title {
      font-size: 12px;
      font-weight: 600;
      line-height: 24px;
      letter-spacing: -0.02em;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      color: #313541;
    }

    .name {
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      color: #313541;
    }

    .number {
      font-size: 12px;
      font-weight: 600;
      line-height: 24px;
      letter-spacing: -0.02em;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
    }

    .data-table {
      border-radius: 8px;
      background-color: #f6f7fc;
    }
  }
</style>
