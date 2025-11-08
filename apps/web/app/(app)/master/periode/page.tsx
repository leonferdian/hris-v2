import MasterDataTemplate from '@/components/master/MasterDataTemplate';

export default function MasterPeriodePage() {
  return (
    <MasterDataTemplate
      title="Master Periode"
      description="Manage periods"
      apiEndpoint="/api/master/periode"
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Nama Periode' },
        { key: 'tahun', label: 'Tahun' },
        { key: 'bulan', label: 'Bulan' },
      ]}
      formFields={[
        { key: 'code', label: 'Code', type: 'text', required: true },
        { key: 'name', label: 'Nama Periode', type: 'text', required: true },
        { key: 'tahun', label: 'Tahun', type: 'number', required: true },
        { key: 'bulan', label: 'Bulan', type: 'number', required: true },
      ]}
    />
  );
}

