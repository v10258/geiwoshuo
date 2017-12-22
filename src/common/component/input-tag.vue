<script>
  /* eslint-disable */
  const validators = {
    email: new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    url : new RegExp(/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i),
    text : new RegExp(/^[a-zA-Z]+$/),
    digits : new RegExp(/^[\d() \.\:\-\+#]+$/),
    isodate : new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/)
  }

  let $ = require('jquery');

  /* eslint-enable */

  export default {
    name: 'InputTag',

    props: {
      tags: {
        type: Array,
        default: () => []
      },
      onChange: {
        type: Function
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      validate: {
        type: String,
        default: ''
      },
      searchurl: {
        type: String,
        default: ''
      },
      limit: {
        type: Number,
        default: 5
      },
      placeholder: {
        type: String,
        default: '添加标签'
      }
    },

    data () {
      return {
        newTag: '',
        autoTags: [],
        autoWidth: 0,
        isMatch: true,
        active: false
      }
    },

    created() {
      let self = this;
      // 点击页面其他位置，关闭城市切换浮层
      $(document).on('click.inputTag', (ev)=>{
        if ($(ev.target).parents('.ui-inputtag').length === 0) {
          self.active = false;
        }
      });
    },

    computed: {
      tagMax: function () {
        console.log('tagMax', this.limit, this.tags.length)
        return this.limit <= this.tags.length;
      },
      tips: function() {
        if (this.limit <= this.tags.length) {
          return `最多输入${this.limit}个标签`;
        } else {
          return this.placeholder;
        }
      }
    },

    watch: {
      autoTags: function () {
        let self = this;
        let widthTotal = this.$el.offsetWidth;
        let left = this.$el.querySelector('.ui-inputtag-new').offsetLeft;
        this.autoWidth = widthTotal - left;
        this.isMatch = this.autoTags.some(function(item){
          return item.name === self.newTag;
        })
      },
      newTag: function() {
        if(this.newTag) {
          this.active = true;
        } else {
          this.active = false;
        }
      }
    },

    methods: {
      focusNewTag () {
        if (this.readOnly) { return }
        this.$el.querySelector('input').focus()
        this.active = true;
        console.log('active true')
      },

      addTag (tag, isNew) {
        if (isNew) {
          tag = {
            name: this.newTag
          }
        }

        if (tag && !this.validateExists(tag) && !this.tagMax) {
          this.tags.push(tag)
          this.tagChange()
        }
        this.newTag = ''
        this.autoTags = [];
      },

      addTagActive () {
        var tag;
        var $active = $(this.$el).find('a.active');
        var activeIndex = $active.index();

        if ($active.data('new')) {
          tag = {
            name: this.newTag
          }
        } else if ($active.length) {
          tag = this.autoTags[activeIndex];
        } else {
          return;
        }

        this.tags.push(tag)
        this.tagChange()
        this.newTag = ''
        this.autoTags = [];
      },

      validateExists (tag) {
        return this.tags.some(function(tagObj){
          return tagObj.name === tag.name;
        })
      },

      validateIfNeeded (tagValue) {
        if (this.validate === '' || this.validate === undefined) {
          return true
        } else if (Object.keys(validators).indexOf(this.validate) > -1) {
          return validators[this.validate].test(tagValue)
        }
        return true
      },

      remove (index) {
        this.tags.splice(index, 1)
        this.tagChange()
      },

      removeLastTag () {
        if (this.newTag) { return }
        this.tags.pop()
        this.tagChange()
      },

      tagChange () {
        if (this.onChange) {
          // avoid passing the observer
          this.onChange(JSON.parse(JSON.stringify(this.tags)))
        }
      },

      autoComplete (ev) {
        this.newTag = ev.currentTarget.value;
        // console.log('autoComplete1', this, this.placeholder, this.searchurl)
        //if (!this.searchurl) { return }

        console.log('auto', this, this.searchurl);

        $.ajax({
          url: this.searchurl,
          type: 'get',
          data: {
            q: ev.currentTarget.value
          },
          dataType: 'json'
        }).done((result) => {
          if (!result.success) { return }
          this.autoTags = result.data;
          console.log('autoTags', this.autoTags);
        })
      },

      selectTag (item) {
        console.log('item', item)
        this.addNew(item)
        this.autoTags = []
      },

      selectDown () {
        var active = this.$el.querySelector('a.active');

        $(active).next().addClass('active').siblings().removeClass('active');
      },

      selectUp () {
        var active = this.$el.querySelector('a.active');

        $(active).prev().addClass('active').siblings().removeClass('active');
      },

      searchItemEnter (ev) {
        var elem = ev.currentTarget;
        
        elem.classList.add('active');
        $(elem).siblings().removeClass('active');
      }
    }
  }
</script>

<template>

<div class="ui-inputtag" @click="focusNewTag()" v-bind:class="{'read-only': readOnly}">
  <span class="ui-inputtag-item" v-for="(tag, index) in tags" v-bind:key="index">
    <em>{{ tag.name }}</em>
    <a v-if="!readOnly" @click.prevent.stop="remove(index)" class="remove"></a>
  </span>
  <input class="ui-inputtag-new" v-if="!readOnly" :disabled="tagMax" :placeholder="tips" type="text" v-model="newTag" v-on:input="autoComplete" v-on:keydown.down="selectDown" v-on:keydown.up="selectUp" v-on:keydown.delete.stop="removeLastTag()" v-on:keydown.enter.188.tab.prevent.stop="addTagActive"/>
  <button class="ui-inputtag-add ion ion-ios-search" @click="autoComplete"></button>
  <div class="ui-inputtag-search" v-bind:style="{ width: autoWidth + 'px' }" v-if="newTag && active">
    <a v-for="(tag, index) in autoTags" v-bind:class="{ active: index === 0 }" v-on:mouseenter="searchItemEnter" @click="addTag(tag)" href="javascript:;">
    {{tag.name}}
    </a>
    <a v-bind:class="{ active: autoTags.length === 0 }" v-if="!isMatch" data-new="true" @click.prevent.stop="addTag(newTag, true)" v-on:mouseenter="searchItemEnter" href="javascript:;">
      创建
      <strong>{{newTag}}</strong>
      标签
    </a>
  </div>
</div>

</template>

<style>
.ui-inputtag {
  position: relative;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 4px;
  cursor: text;
  text-align: left;

  &:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: none;
  }
}

.ui-inputtag-item {
  background-color: #f6f9fa;
  border-radius: 2px;
  border: 1px solid #c8d6df;
  color: #638421;
  display: inline-block;
  font-size: 13px;
  font-weight: 400;
  margin-right: 4px;
  padding: 3px;
}

.ui-inputtag-item em {
  font-style: normal;
  color: #585858;
}

.ui-inputtag-item .remove {
  cursor: pointer;
  font-weight: bold;
  color: #638421;
}

.ui-inputtag-item .remove:hover {
  text-decoration: none;
}

.ui-inputtag-item .remove::before {
  content: " x";
}

.ui-inputtag-new {
  width: 150px;
  background: transparent;
  border: 0;
  color: #777;
  font-size: 13px;
  font-weight: 400;
  outline: none;
  padding: 4px;
  padding-left: 0;
}

.ui-inputtag-add {
  position: absolute;
  top: 12px;
  right: 10px;
  border: none;
  background: transparent;
}

.ui-inputtag.read-only {
  cursor: default;
}

.ui-inputtag-search {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #e7eaf1;
  border-top: none;
  margin-top: 2px;
}

.ui-inputtag-search a {
  padding: 5px 10px;
  text-decoration: none;
  cursor: pointer;
}

.ui-inputtag-search a.active,
.ui-inputtag-search a:active {
  background: #f4f8fb;
}
</style>
