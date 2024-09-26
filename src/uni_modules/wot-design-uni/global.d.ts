declare module 'vue' {
  // Helper for Volar
  export interface GlobalComponents {
    WdActionSheet: typeof import('./components/wd-action-sheet/wd-action-sheet.vue')['default']
    WdBadge: typeof import('./components/pro-badge/pro-badge.vue')['default']
    WdButton: typeof import('./components/wd-button/wd-button.vue')['default']
    WdCalendar: typeof import('./components/wd-calendar/wd-calendar.vue')['default']
    WdCalendarView: typeof import('./components/wd-calendar-view/wd-calendar-view.vue')['default']
    WdCard: typeof import('./components/wd-card/wd-card.vue')['default']
    WdCell: typeof import('./components/wd-cell/wd-cell.vue')['default']
    WdCellGroup: typeof import('./components/pro-cell-group/pro-cell-group.vue')['default']
    WdCheckbox: typeof import('./components/wd-checkbox/wd-checkbox.vue')['default']
    WdCheckboxGroup: typeof import('./components/pro-checkbox-group/pro-checkbox-group.vue')['default']
    WdCol: typeof import('./components/wd-col/wd-col.vue')['default']
    WdColPicker: typeof import('./components/wd-col-picker/wd-col-picker.vue')['default']
    WdCollapse: typeof import('./components/pro-collapse/pro-collapse.vue')['default']
    WdCollapseItem: typeof import('./components/pro-collapse-item/pro-collapse-item.vue')['default']
    WdCurtain: typeof import('./components/pro-curtain/pro-curtain.vue')['default']
    WdDatetimePicker: typeof import('./components/wd-datetime-picker/wd-datetime-picker.vue')['default']
    WdDatetimePickerView: typeof import('./components/wd-datetime-picker-view/wd-datetime-picker-view.vue')['default']
    ProDivider: typeof import('./components/pro-divider/pro-divider.vue')['default']
    WdDropMenu: typeof import('./components/pro-drop-menu/pro-drop-menu.vue')['default']
    WdDropMenuItem: typeof import('./components/pro-drop-menu-item/pro-drop-menu-item.vue')['default']
    WdGrid: typeof import('./components/wd-grid/wd-grid.vue')['default']
    WdGridItem: typeof import('./components/wd-grid-item/wd-grid-item.vue')['default']
    WdIcon: typeof import('./components/pro-icon/pro-icon.vue')['default']
    WdImg: typeof import('./components/wd-img/wd-img.vue')['default']
    WdImgCropper: typeof import('./components/wd-img-cropper/wd-img-cropper.vue')['default']
    WdInput: typeof import('./components/wd-input/wd-input.vue')['default']
    WdInputNumber: typeof import('./components/wd-input-number/wd-input-number.vue')['default']
    ProLoading: typeof import('./components/pro-loading/pro-loading.vue')['default']
    ProLoadmore: typeof import('./components/pro-loadmore/pro-loadmore.vue')['default']
    WdMessageBox: typeof import('./components/wd-message-box/wd-message-box.vue')['default']
    ProOverlay: typeof import('./components/pro-overlay/pro-overlay.vue')['default']
    WdNoticeBar: typeof import('./components/wd-notice-bar/wd-notice-bar.vue')['default']
    WdPagination: typeof import('./components/wd-pagination/wd-pagination.vue')['default']
    WdPicker: typeof import('./components/wd-picker/wd-picker.vue')['default']
    WdPickerView: typeof import('./components/wd-picker-view/wd-picker-view.vue')['default']
    WdPopover: typeof import('./components/wd-popover/wd-popover.vue')['default']
    ProPopup: typeof import('./components/pro-popup/pro-popup.vue')['default']
    WdProgress: typeof import('./components/wd-progress/wd-progress.vue')['default']
    WdRadio: typeof import('./components/wd-radio/wd-radio.vue')['default']
    WdRadioGroup: typeof import('./components/pro-radio-group/pro-radio-group.vue')['default']
    WdRate: typeof import('./components/pro-rate/pro-rate.vue')['default']
    WdResize: typeof import('./components/pro-resize/pro-resize.vue')['default']
    WdSearch: typeof import('./components/wd-search/wd-search.vue')['default']
    WdSelectPicker: typeof import('./components/wd-select-picker/wd-select-picker.vue')['default']
    WdSlider: typeof import('./components/wd-slider/wd-slider.vue')['default']
    WdSortButton: typeof import('./components/wd-sort-button/wd-sort-button.vue')['default']
    WdStatusTip: typeof import('./components/pro-status-tip/pro-status-tip.vue')['default']
    WdStep: typeof import('./components/wd-step/wd-step.vue')['default']
    WdSteps: typeof import('./components/pro-steps/pro-steps.vue')['default']
    WdSticky: typeof import('./components/pro-sticky/pro-sticky.vue')['default']
    WdStickyBox: typeof import('./components/pro-sticky-box/pro-sticky-box.vue')['default']
    WdSwipeAction: typeof import('./components/wd-swipe-action/wd-swipe-action.vue')['default']
    WdSwitch: typeof import('./components/pro-switch/pro-switch.vue')['default']
    WdTab: typeof import('./components/wd-tab/wd-tab.vue')['default']
    WdTabs: typeof import('./components/wd-tabs/wd-tabs.vue')['default']
    WdTag: typeof import('./components/wd-tag/wd-tag.vue')['default']
    WdToast: typeof import('./components/pro-toast/pro-toast.vue')['default']
    WdTooltip: typeof import('./components/wd-tooltip/wd-tooltip.vue')['default']
    WdTransition: typeof import('./components/pro-transition/pro-transition.vue')['default']
    WdUpload: typeof import('./components/wd-upload/wd-upload.vue')['default']
    WdNotify: typeof import('./components/pro-notify/pro-notify.vue')['default']
    ProWatermark: typeof import('./components/pro-watermark/pro-watermark.vue')['default']
    ProCircle: typeof import('./components/pro-circle/pro-circle.vue')['default']
    WdSwiper: typeof import('./components/wd-swiper/wd-swiper.vue')['default']
    WdSwiperNav: typeof import('./components/wd-swiper-nav/wd-swiper-nav.vue')['default']
    WdSegmented: typeof import('./components/pro-segmented/pro-segmented.vue')['default']
    WdTabbar: typeof import('./components/wd-tabbar/wd-tabbar.vue')['default']
    WdTabbarItem: typeof import('./components/pro-tabbar-item/pro-tabbar-item.vue')['default']
    WdNavbar: typeof import('./components/wd-navbar/wd-navbar.vue')['default']
    WdNavbarCapsule: typeof import('./components/wd-navbar-capsule/wd-navbar-capsule.vue')['default']
    WdTable: typeof import('./components/wd-table/wd-table.vue')['default']
    WdTableCol: typeof import('./components/wd-table-col/wd-table-col.vue')['default']
    WdSidebar: typeof import('./components/wd-sidebar/wd-sidebar.vue')['default']
    WdSidebarItem: typeof import('./components/wd-sidebar-item/wd-sidebar-item.vue')['default']
    WdFab: typeof import('./components/wd-fab/wd-fab.vue')['default']
    WdCountDown: typeof import('./components/pro-count-down/pro-count-down.vue')['default']
    WdNumberKeyboard: typeof import('./components/wd-number-keyboard/wd-number-keyboard.vue')['default']
    WdPasswordInput: typeof import('./components/pro-password-input/pro-password-input.vue')['default']
    WdForm: typeof import('./components/pro-form/pro-form.vue')['default']
    WdTextarea: typeof import('./components/wd-textarea/wd-textarea.vue')['default']
    WdVideoPreview: typeof import('./components/wd-video-preview/wd-video-preview.vue')['default']
    ProBacktop: typeof import('./components/pro-backtop/pro-backtop.vue')['default']
    WdSkeleton: typeof import('./components/wd-skeleton/wd-skeleton.vue')['default']
    WdIndexBar: typeof import('./components/pro-index-anchor/pro-index-anchor.vue')['default']
    WdIndexAnchor: typeof import('./components/pro-index-anchor/wd-index-anchor.vue')['default']
    WdText: typeof import('./components/wd-text/wd-text.vue')['default']
    WdCountTo: typeof import('./components/pro-count-to/pro-count-to.vue')['default']
  }
}

export {}
