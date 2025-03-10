<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="max-width: 880px; width: 100%">
      <q-card-section>
        <div class="text-h6">Scoredcard Trends</div>
        <div class="row">
          <div class="col-3">
            <div class="q-pa-md">
              <q-input
                v-model="dateFrom"
                outlined
                mask="date"
                :rules="['date']"
                dense
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="dateFrom"
                        dense
                        mask="YYYY-MM-DD"
                        @update:model-value="setScoreData"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <div class="col-3">
            <div class="q-pa-md">
              <q-input
                v-model="dateTo"
                outlined
                mask="date"
                :rules="['date']"
                dense
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="dateTo"
                        dense
                        mask="YYYY-MM-DD"
                        @update:model-value="setScoreData"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <ScoreCardChart :data="scoreCardTrendData" />
      </q-card-section>

      <q-card-section>
        <div class="row grades-container">
          <div class="grade F">
            <div>F</div>
            <div class="description"></div>
          </div>
          <div class="grade D">
            <div>D</div>
            <div class="description">>60%</div>
          </div>
          <div class="grade C">
            <div>C</div>
            <div class="description">>70%</div>
          </div>
          <div class="grade B">
            <div>B</div>
            <div class="description">>80%</div>
          </div>
          <div class="grade A">
            <div>A</div>
            <div class="description">>90%</div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from 'quasar';
  import ScoreCardChart from '../ScoreCardChart.vue';
  import { onMounted, ref } from 'vue';
  import { ScanService } from 'src/services';

  defineEmits([...useDialogPluginComponent.emits]);

  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  const scoreCardTrendData = ref([] as { label: string; grade: string }[]);

  const dateTo = ref();
  const dateFrom = ref();

  function setScoreData() {
    const dateFromAux = new Date(dateFrom.value);
    const dateToAux = new Date(dateTo.value);
    ScanService.getScorecardTrends(
      dateFromAux.toISOString().split('T')[0],
      dateToAux.toISOString().split('T')[0]
    ).then(response => {
      scoreCardTrendData.value = response.data.map(value => ({
        label: value.alias,
        start:
          Number((value.oldest_score || value.latest_score || 0)?.toFixed(4)) *
          100,
        width:
          Number(
            (
              value.latest_score - (value.oldest_score || value.latest_score)
            ).toFixed(4)
          ) * 100,
        grade: value.latest_score_grade
      }));
    });
  }

  onMounted(() => {
    const currentDate = new Date();
    const pastweek = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
    pastweek.setDate(currentDate.getDate() - 7);
    dateTo.value = currentDate.toISOString().split('T')[0];
    dateFrom.value = pastweek.toISOString().split('T')[0];
    setScoreData();
  });
</script>

<style lang="scss">
  .grades-container {
    display: flex;
    width: 100%;
    height: 3rem;
    gap: 0.2em;

    .grade {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 3rem;
      width: 4rem;
      color: white;

      .description {
        font-size: 0.7em;
      }

      &.A {
        background-color: #97b951;
      }

      &.B {
        background-color: #fbbf65;
      }

      &.C {
        background-color: #f6a800;
      }

      &.D {
        background-color: #f3a488;
      }
      &.F {
        background-color: #e5494d;
      }
    }
  }
</style>
