import { 
    Button,ButtonGroup,Container,Header,Aside,Main,Footer,
    MessageBox,Message,Loading,Dialog,
    Menu,MenuItem,MenuItemGroup,Submenu,
    Card, Form, FormItem, Input,Switch,Select,Option,CheckboxGroup, Checkbox, Radio,RadioGroup,
    Table, TableColumn, Pagination, Breadcrumb,
    BreadcrumbItem,Tooltip,Popover,Tag,Row,Col,Tree,
    DatePicker, Link, Upload, Cascader,Tabs,TabPane,Alert,Image,Timeline,TimelineItem
} from 'element-ui';
import 'element-ui/lib/theme-chalk/button.css';
import 'element-ui/lib/theme-chalk/container.css';
import 'element-ui/lib/theme-chalk/header.css';
import 'element-ui/lib/theme-chalk/aside.css';
import 'element-ui/lib/theme-chalk/main.css';
import 'element-ui/lib/theme-chalk/footer.css';
import 'element-ui/lib/theme-chalk/message-box.css';
import 'element-ui/lib/theme-chalk/message.css';
import 'element-ui/lib/theme-chalk/loading.css';
import 'element-ui/lib/theme-chalk/menu.css';
import 'element-ui/lib/theme-chalk/tooltip.css';
import 'element-ui/lib/theme-chalk/icon.css';
import 'element-ui/lib/theme-chalk/card.css';
import 'element-ui/lib/theme-chalk/form.css';
import 'element-ui/lib/theme-chalk/input.css';
import 'element-ui/lib/theme-chalk/switch.css';
import 'element-ui/lib/theme-chalk/select.css';
import 'element-ui/lib/theme-chalk/option.css';
import 'element-ui/lib/theme-chalk/checkbox-group.css';
import 'element-ui/lib/theme-chalk/checkbox.css';
import 'element-ui/lib/theme-chalk/radio-group.css';
import 'element-ui/lib/theme-chalk/radio.css';
import 'element-ui/lib/theme-chalk/table.css';
import 'element-ui/lib/theme-chalk/table-column.css';
import 'element-ui/lib/theme-chalk/pagination.css';
import 'element-ui/lib/theme-chalk/dialog.css';
import 'element-ui/lib/theme-chalk/breadcrumb.css';
import 'element-ui/lib/theme-chalk/tooltip.css';
import 'element-ui/lib/theme-chalk/popover.css';
import 'element-ui/lib/theme-chalk/tag.css';
import 'element-ui/lib/theme-chalk/row.css';
import 'element-ui/lib/theme-chalk/col.css';
import 'element-ui/lib/theme-chalk/tree.css';
import 'element-ui/lib/theme-chalk/date-picker.css';
import 'element-ui/lib/theme-chalk/link.css';
import 'element-ui/lib/theme-chalk/upload.css';
import 'element-ui/lib/theme-chalk/cascader.css';
import 'element-ui/lib/theme-chalk/tabs.css';
import 'element-ui/lib/theme-chalk/tab-pane.css';
import 'element-ui/lib/theme-chalk/alert.css';
import 'element-ui/lib/theme-chalk/image.css';
import 'element-ui/lib/theme-chalk/timeline.css';
import 'element-ui/lib/theme-chalk/timeline-item.css';
export default {
    install:function(Vue){
        Vue.prototype.$ELEMENT = { size: 'small'};
        Vue.use(Button);
        Vue.use(ButtonGroup);
        Vue.use(Container);
        Vue.use(Header);
        Vue.use(Aside);
        Vue.use(Main);
        Vue.use(Footer);
        Vue.use(Menu);
        Vue.use(MenuItem);
        Vue.use(MenuItemGroup);
        Vue.use(Submenu);
        Vue.use(Card);
        Vue.use(Form);
        Vue.use(FormItem);
        Vue.use(Input);
        Vue.use(Switch);
        Vue.use(Select);
        Vue.use(Option);
        Vue.use(CheckboxGroup);
        Vue.use(Checkbox);
        Vue.use(RadioGroup);
        Vue.use(Radio);
        Vue.use(Table);
        Vue.use(TableColumn);
        Vue.use(Pagination);
        Vue.use(Dialog);
        Vue.use(Breadcrumb);
        Vue.use(BreadcrumbItem);
        Vue.use(Tooltip);
        Vue.use(Popover);
        Vue.use(Loading);
        Vue.use(Tag);
        Vue.use(Row);
        Vue.use(Col);
        Vue.use(Tree);
        Vue.use(DatePicker);
        Vue.use(Link);
        Vue.use(Upload);
        Vue.use(Cascader);
        Vue.use(Tabs);
        Vue.use(TabPane);
        Vue.use(Alert);
        Vue.use(Image);
        Vue.use(Timeline);
        Vue.use(TimelineItem);
        Vue.prototype.$message = Message;
        Vue.prototype.$confirm = function (msg = "", title = "提示", opts = {}) {
            if(typeof msg=="object"){
                opts = msg;
                msg = "";
                title = "提示";
            }else  if(typeof title=="object"){
                opts = title;
                title = "提示";
            }
            let defaults = {
                type: "warning",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                dangerouslyUseHTMLString: true
            }
            let options = Object.assign(defaults,opts);
            return MessageBox.confirm(msg, title, options)
        };
    }
}