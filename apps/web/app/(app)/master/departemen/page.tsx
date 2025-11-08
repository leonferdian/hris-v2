import MasterDataTemplate from '@/components/master/MasterDataTemplate';

export default function MasterDepartemenPage() {
  return (
    <MasterDataTemplate
      title="Master Departemen"
      description="Manage departments"
      apiEndpoint="/api/master/departemen"
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Nama Departemen' },
        { key: 'description', label: 'Deskripsi' },
      ]}
      formFields={[
        { key: 'code', label: 'Code', type: 'text', required: true },
        { key: 'name', label: 'Nama Departemen', type: 'text', required: true },
        { key: 'description', label: 'Deskripsi', type: 'textarea', required: false },
      ]}
    />
  );
}

