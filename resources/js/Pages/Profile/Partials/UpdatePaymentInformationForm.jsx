import { useForm, usePage } from "@inertiajs/react";
import {
    TextInput,
    Button,
    Stack,
    Group,
    Transition,
    Text,
    Paper,
    Alert,
    Select,
} from "@mantine/core";
import {
    IconDeviceFloppy,
    IconBuildingBank,
    IconCreditCard,
    IconUserCheck,
    IconInfoCircle,
    IconWallet,
} from "@tabler/icons-react";

export default function UpdatePaymentInformationForm({
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            bank_name: user.bank_name || "",
            bank_account_number: user.bank_account_number || "",
            bank_account_name: user.bank_account_name || "",
        });

    // Daftar Bank & E-Wallet (Sesuai dengan kebutuhan aplikasi affiliate)
    const paymentMethods = [
        {
            group: "Bank Transfer",
            items: [
                { value: "BCA", label: "BCA" },
                { value: "BNI", label: "BNI" },
                { value: "BRI", label: "BRI" },
                { value: "MANDIRI", label: "MANDIRI" },
                { value: "BSI", label: "BSI" },
            ],
        },
        {
            group: "E-Wallet",
            items: [
                { value: "DANA", label: "DANA" },
                { value: "OVO", label: "OVO" },
                { value: "GOPAY", label: "GOPAY" },
                { value: "SHOPEEPAY", label: "SHOPEEPAY" },
                { value: "LINKAJA", label: "LINKAJA" },
            ],
        },
    ];

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"), {
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <Alert
                variant="light"
                color="blue"
                title="Informasi Pembayaran"
                icon={<IconInfoCircle />}
            >
                Pastikan data rekening atau e-wallet benar untuk menghindari
                kendala saat pencairan komisi.
            </Alert>

            <form onSubmit={submit} style={{ marginTop: "1.5rem" }}>
                <Stack gap="lg">
                    <Select
                        label="Metode Pembayaran (Bank / E-Wallet)"
                        placeholder="Pilih Bank atau E-Wallet"
                        data={paymentMethods}
                        searchable
                        leftSection={
                            data.bank_name &&
                            [
                                "DANA",
                                "OVO",
                                "GOPAY",
                                "SHOPEEPAY",
                                "LINKAJA",
                            ].includes(data.bank_name) ? (
                                <IconWallet size={18} stroke={1.5} />
                            ) : (
                                <IconBuildingBank size={18} stroke={1.5} />
                            )
                        }
                        value={data.bank_name}
                        onChange={(val) => setData("bank_name", val)}
                        error={errors.bank_name}
                        required
                    />

                    <TextInput
                        label="Nomor Rekening / Nomor HP E-Wallet"
                        placeholder="Masukkan nomor rekening atau nomor HP"
                        leftSection={<IconCreditCard size={18} stroke={1.5} />}
                        value={data.bank_account_number}
                        onChange={(e) =>
                            setData("bank_account_number", e.target.value)
                        }
                        error={errors.bank_account_number}
                        required
                    />

                    <TextInput
                        label="Nama Pemilik Akun"
                        placeholder="Nama sesuai buku tabungan atau aplikasi e-wallet"
                        leftSection={<IconUserCheck size={18} stroke={1.5} />}
                        value={data.bank_account_name}
                        onChange={(e) =>
                            setData("bank_account_name", e.target.value)
                        }
                        error={errors.bank_account_name}
                        required
                    />

                    <Paper
                        withBorder
                        p="md"
                        radius="md"
                        mt="xl"
                        style={{ borderStyle: "dashed" }}
                    >
                        <Group justify="space-between">
                            <Transition
                                mounted={recentlySuccessful}
                                transition="fade"
                                duration={400}
                            >
                                {(styles) => (
                                    <Text
                                        size="sm"
                                        c="teal"
                                        fw={600}
                                        style={styles}
                                    >
                                        ✓ Rekening tersimpan
                                    </Text>
                                )}
                            </Transition>

                            <Button
                                type="submit"
                                loading={processing}
                                leftSection={<IconDeviceFloppy size={18} />}
                                color="blue"
                            >
                                Simpan Rekening
                            </Button>
                        </Group>
                    </Paper>
                </Stack>
            </form>
        </section>
    );
}
