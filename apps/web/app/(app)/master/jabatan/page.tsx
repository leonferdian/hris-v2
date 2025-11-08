import MasterDataTemplate from '@/components/master/MasterDataTemplate';

export default function MasterJabatanPage() {
  return (
    <MasterDataTemplate
      title="Master Jabatan"
      description="Manage job positions"
      apiEndpoint="/api/master/jabatan"
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Nama Jabatan' },
        { key: 'level', label: 'Level' },
      ]}
      formFields={[
        { key: 'code', label: 'Code', type: 'text', required: true },
        { key: 'name', label: 'Nama Jabatan', type: 'text', required: true },
        { key: 'level', label: 'Level', type: 'text', required: false },
        { key: 'description', label: 'Deskripsi', type: 'textarea', required: false },
      ]}
    />
  );
}

