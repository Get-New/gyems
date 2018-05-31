
var Page = {
   
    current_tree_select_id: 'root',
    
    init: function () {
        this.tree_init();
        dst.config({ type: 'day' });
        var t = dst.getCurrType();
        dst.change(function (t, y, m, d) {           
        })
        dst.init();

        $('#goback').click(function () {
            window.history.go(-1);
        })
    },

    my_tree: null,

    tree_config: {
        url: '/api/FactoryModelbase/GetTree',        
        root_name: '能源工厂',
        id_field: 'ModelBaseId',
        name_field: 'ModelBaseName'
    },

    tree_init: function () {

        var that = this;

        // 初始化树(第一个参数是页面对象本身的指针，第二个参数是树配置)
        this.my_tree = new MyTree(this, this.tree_config);

        // 绑定树节点点击方法
        this.my_tree.bind_node_click_event_handler(this.tree_node_click);

        // 查询树
        this.my_tree.query();

        // 刷新按钮
        $('#refresh').click(function () {
            that.my_tree.reset();
            that.current_tree_select_id = 'root';
        });
    },

    tree_node_click: function (id) {
        this.clear();        
        this.current_tree_select_id = id;
     }
}
