jQuery(function(e){e(".dsm-toggle-btn .dsm-input").each(function(){var t=e(this).parents(".dsm-content-toggle").find(".dsm-content-toggle-back"),n=e(this).parents(".dsm-content-toggle").find(".dsm-content-toggle-front");this.checked?(n.hide(),t.show()):(t.hide(),n.show()),e(this).on("change",function(){if(this.checked){if(t.find(".et_pb_gallery").length){var i=e(t.find(".et_pb_gallery"));window.et_pb_gallery_init(i)}n.hide(),t.show()}else{if(n.find(".et_pb_gallery").length){i=e(n.find(".et_pb_gallery"));window.et_pb_gallery_init(i)}t.hide(),n.show()}})})});