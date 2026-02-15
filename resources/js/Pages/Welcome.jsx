import { Link, Head } from "@inertiajs/react";
import {
    Container,
    Title,
    Text as MantineText,
    Button,
    Group,
    Stack,
    Card,
    Anchor,
} from "@mantine/core";

export default function Welcome({ auth }) {
    const user = auth?.user;

    return (
        <>
            <Head title="Welcome" />

            <Container
                size="md"
                py="xl"
                style={{ marginTop: "100px", textAlign: "center" }}
            >
                <Stack align="center" gap="lg">
                    <Title
                        order={1}
                        size="3rem"
                        fw={900}
                        variant="gradient"
                        gradient={{ from: "blue", to: "cyan", deg: 90 }}
                    >
                        Akujualin
                    </Title>

                    <MantineText size="lg" c="dimmed" maw={600}>
                        Platform Affiliate Marketing terintegrasi untuk
                        Mahasiswa dan UMKM. Hubungkan produk, bagikan link, dan
                        raih komisi.
                    </MantineText>

                    <Group mt="xl">
                        {user ? (
                            <Stack>
                                <MantineText fw={500}>
                                    Halo, {user.name}!
                                </MantineText>

                                {/* LOGIC ROUTE BUTTON */}
                                <Button
                                    component={Link}
                                    href={route(
                                        user.role === "admin"
                                            ? "admin.dashboard"
                                            : user.role === "staff_umkm"
                                              ? "staff.dashboard"
                                              : "mahasiswa.dashboard",
                                    )}
                                    size="lg"
                                    variant="filled"
                                    color="blue"
                                >
                                    Masuk ke Dashboard
                                </Button>
                            </Stack>
                        ) : (
                            <Group>
                                {/* CARA BENAR: Gunakan component={Link} */}
                                <Button
                                    component={Link}
                                    href={route("login")}
                                    size="lg"
                                    variant="default"
                                >
                                    Masuk (Login)
                                </Button>

                                <Button
                                    component={Link}
                                    href={route("register")}
                                    size="lg"
                                    variant="filled"
                                    color="blue"
                                >
                                    Daftar Sekarang
                                </Button>
                            </Group>
                        )}
                    </Group>

                    <Card
                        withBorder
                        shadow="sm"
                        p="lg"
                        radius="md"
                        mt={50}
                        w="100%"
                    >
                        <MantineText size="sm" fw={700} mb="xs">
                            Tech Stack Info:
                        </MantineText>
                        <Group justify="center" gap="xs">
                            <Button variant="light" size="xs" color="violet">
                                Laravel 12
                            </Button>
                            <Button variant="light" size="xs" color="cyan">
                                React
                            </Button>
                            <Button variant="light" size="xs" color="blue">
                                Mantine UI
                            </Button>
                        </Group>
                    </Card>
                </Stack>
            </Container>
        </>
    );
}
