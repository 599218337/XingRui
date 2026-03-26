<!--
 * @Author: yangyz yangyz@zhiwyl.com
 * @Date: 2024-09-25 15:53:28
 * @LastEditors: yangyz yangyz@zhiwyl.com
 * @LastEditTime: 2024-09-26 12:28:19
 * @FilePath: \screen-web\src\components\PersonnelStatistics\PersonnelStatistics.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="environmentalData">
    <div class="header">
      <span>原料和产品库存</span>
    </div>
    <div class="content">
      <div class="column-container">
        <div class="side-column scrollable-column">
          <div class="scroll-wrapper" :class="{ 'animate-scroll': leftData.length > 3 }" :style="{ animationDuration: leftData.length * 6 + 's' }">
            <div class="cyber-item" v-for="(item, index) in leftData" :key="'l-' + index">
              <div class="item-header">
                <div class="item-label" :title="item.label1">{{ item.label1 }}</div>
                <div class="item-percent">{{ item.label3 }}</div>
              </div>
              <div class="item-body">
                <div class="item-values-row">
                  <div class="item-value">{{ item.label2 }}吨</div>
                </div>
                <div class="item-progress">
                  <div class="progress-fill" :style="{ width: item.label3 }"></div>
                </div>
              </div>
              <div class="item-decor"></div>
            </div>
            <!-- Duplicate for seamless loop -->
            <div v-if="leftData.length > 3" class="cyber-item" v-for="(item, index) in leftData" :key="'l-dup-' + index">
              <div class="item-header">
                <div class="item-label" :title="item.label1">{{ item.label1 }}</div>
                <div class="item-percent">{{ item.label3 }}</div>
              </div>
              <div class="item-body">
                <div class="item-values-row">
                  <div class="item-value">{{ item.label2 }}吨</div>
                </div>
                <div class="item-progress">
                  <div class="progress-fill" :style="{ width: item.label3 }"></div>
                </div>
              </div>
              <div class="item-decor"></div>
            </div>
          </div>
        </div>

        <div class="side-column scrollable-column">
          <div class="scroll-wrapper" :class="{ 'animate-scroll': rightData.length > 3 }" :style="{ animationDuration: rightData.length * 6 + 's' }">
            <div class="cyber-item" v-for="(item, index) in rightData" :key="'r-' + index">
              <div class="item-header">
                <div class="item-label" :title="item.label1">{{ item.label1 }}</div>
                <div class="item-percent">{{ item.label3 }}</div>
              </div>
              <div class="item-body">
                <div class="item-values-row">
                  <div class="item-value">{{ item.label2 }}吨</div>
                </div>
                <div class="item-progress">
                  <div class="progress-fill" :style="{ width: item.label3 }"></div>
                </div>
              </div>
              <div class="item-decor"></div>
            </div>
            <!-- Duplicate for seamless loop -->
            <div v-if="rightData.length > 3" class="cyber-item" v-for="(item, index) in rightData" :key="'r-dup-' + index">
              <div class="item-header">
                <div class="item-label" :title="item.label1">{{ item.label1 }}</div>
                <div class="item-percent">{{ item.label3 }}</div>
              </div>
              <div class="item-body">
                <div class="item-values-row">
                  <div class="item-value">{{ item.label2 }}吨</div>
                </div>
                <div class="item-progress">
                  <div class="progress-fill" :style="{ width: item.label3 }"></div>
                </div>
              </div>
              <div class="item-decor"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="line"></div>

  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { ref, watch, onMounted } from 'vue'

const leftData = reactive([

])
const rightData = reactive([

])


onMounted(async () => {
  try {

    const response = await fetch('/nodeApi/getMaterialsNum')
    if (!response.ok) throw new Error('Network response was not ok')
    const result = await response.json()

    // Assuming result.data is an array of { materialName, num }
    // Or adjust based on the actual response structure
    const data = result.data || result

    // Grouping by material name
    const groupedMap = new Map();
    data.forEach(item => {
      const name = item['物料名称'];
      const currentLevel = parseFloat(item['当前罐量']) || 0;
      const maxLevel = parseFloat(item['最大罐量']) || 0;

      if (groupedMap.has(name)) {
        const existing = groupedMap.get(name);
        existing.current += currentLevel;
        existing.max += maxLevel;
      } else {
        groupedMap.set(name, {
          name,
          current: currentLevel,
          max: maxLevel
        });
      }
    });

    const formattedData = Array.from(groupedMap.values()).map((group, index) => {
      const maxLevel = group.max || 1; // Prevent division by zero
      const currentLevel = group.current;
      const percentage = Math.min(100, Math.max(0, Math.round((currentLevel / maxLevel) * 100)));

      return {
        id: index,
        label1: group.name,
        label2: parseFloat(currentLevel.toFixed(2)),
        label3: percentage + '%',
      };
    })

    // Split data into two halves
    const half = Math.ceil(formattedData.length / 2)
    leftData.splice(0, leftData.length, ...formattedData.slice(0, half))
    rightData.splice(0, rightData.length, ...formattedData.slice(half))
  } catch (error) {
    console.error('Failed to fetch materials data:', error)
  }
})

</script>

<style lang="scss" scoped>
@import url('./EnvironmentalData.scss');
</style>