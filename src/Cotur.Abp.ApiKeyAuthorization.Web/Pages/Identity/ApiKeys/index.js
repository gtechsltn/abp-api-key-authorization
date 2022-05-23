(function ($) {
    var l = abp.localization.getResource('ApiKeyAuthorization');

    var _identityApiKeyAppService = cotur.abp.apiKeyAuthorization.apiKeys.apiKeys;
    var _editModal = new abp.ModalManager(
        abp.appPath + 'Identity/ApiKeys/EditModal'
    );
    var _createModal = new abp.ModalManager(
        abp.appPath + 'Identity/ApiKeys/CreateModal'
    );
    var _permissionsModal = new abp.ModalManager(
        abp.appPath + 'AbpPermissionManagement/PermissionManagementModal'
    );

    var _dataTable = null;

    abp.ui.extensions.entityActions.get('identity.apiKeys').addContributor(
        function(actionList) {
            return actionList.addManyTail(
                [
                    {
                        text: l('Edit'),
                        visible: abp.auth.isGranted(
                            'ApiKeyAuthorization.ApiKeys.Update'
                        ),
                        action: function (data) {
                            _editModal.open({
                                id: data.record.id,
                            });
                        },
                    },
                    {
                        text: l('Permissions'),
                        visible: abp.auth.isGranted(
                            'ApiKeyAuthorization.ApiKeys.ManagePermissions'
                        ),
                        action: function (data) {
                            _permissionsModal.open({
                                providerName: 'ApiKey',
                                providerKey: data.record.id,
                                providerKeyDisplayName: data.record.name
                            });
                        },
                    },
                    {
                        text: l('Delete'),
                        visible: abp.auth.isGranted(
                            'ApiKeyAuthorization.ApiKeys.Delete'
                        ),
                        confirmMessage: function (data) {
                            return l(
                                'UserDeletionConfirmationMessage',
                                data.record.userName
                            );
                        },
                        action: function (data) {
                            _identityApiKeyAppService
                                .delete(data.record.id)
                                .then(function () {
                                    _dataTable.ajax.reload();
                                    abp.notify.success(l('SuccessfullyDeleted'));
                                });
                        },
                    }
                ]
            );
        }
    );

    abp.ui.extensions.tableColumns.get('identity.apiKeys').addContributor(
        function (columnList) {
            columnList.addManyTail(
                [
                    {
                        title: l("Actions"),
                        rowAction: {
                            items: abp.ui.extensions.entityActions.get('identity.apiKeys').actions.toArray()
                        }
                    },
                    {
                        title: l('Name'),
                        data: 'name'
                    },
                    {
                        title: l('Key'),
                        data: 'key',
                    },
                    {
                        title: l('Active'),
                        data: 'active',
                        render: function (data, type, row) {
                            row.active = $.fn.dataTable.render.text().display(row.active);
                            if (!row.active) {
                                return  'Disabled';
                            }else{
                                return  'Active';
                            }
                        }
                    }
                ]
            );
        },
        0 //adds as the first contributor
    );

    $(function () {
        var _$wrapper = $('#IdentityApiKeysWrapper');
        var _$table = _$wrapper.find('table');
        _dataTable = _$table.DataTable(
            abp.libs.datatables.normalizeConfiguration({
                order: [[1, 'asc']],
                processing: true,
                serverSide: true,
                scrollX: true,
                paging: true,
                ajax: abp.libs.datatables.createAjax(
                    _identityApiKeyAppService.getList
                ),
                columnDefs: abp.ui.extensions.tableColumns.get('identity.apiKeys').columns.toArray()
            })
        );

        _createModal.onResult(function () {
            _dataTable.ajax.reload();
        });

        _editModal.onResult(function () {
            _dataTable.ajax.reload();
        });

        _$wrapper.find('button[name=CreateApiKey]').click(function (e) {
            e.preventDefault();
            _createModal.open();
        });
    });
})(jQuery);
