import { Component, Vue } from "vue-property-decorator";

@Component
export default class scrollerUtils extends Vue {
  public dispatch(componentName: string, eventName: string, ...rest: any[]) {
    let parent = this.$parent || this.$root;
    let name = parent.$options.name;

    while (parent && (!name || name !== componentName)) {
      parent = parent.$parent;
      if (parent) {
        name = parent.$options.name;
      }
    }
    if (parent) {
      parent.$emit.apply(parent, [eventName, ...rest]);
    }
  }
}
