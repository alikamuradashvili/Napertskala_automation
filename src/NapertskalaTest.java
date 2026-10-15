import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** Click the green Run arrow beside this class to run the browser tests. */
public final class NapertskalaTest {
    public static void main(String[] args) throws Exception {
        Path project = Path.of(System.getProperty("user.dir")).toAbsolutePath();
        while (project != null && !Files.isRegularFile(project.resolve("app.js"))) {
            project = project.getParent();
        }
        if (project == null) {
            throw new IllegalStateException("Set the Run configuration working directory to the Napertskala_automation folder.");
        }

        List<String> command = new ArrayList<>();
        command.add(findNode());
        command.add(project.resolve("app.js").toString());
        if (!Arrays.asList(args).contains("--headless")) command.add("--visible");
        if (Arrays.asList(args).contains("--smoke")) command.add("--smoke");

        System.out.println("Starting Napertskala Chrome tests...");
        Process process = new ProcessBuilder(command).directory(project.toFile()).inheritIO().start();
        Thread cleanup = new Thread(() -> {
            process.descendants().forEach(ProcessHandle::destroy);
            process.destroy();
        });
        Runtime.getRuntime().addShutdownHook(cleanup);
        int result;
        try {
            result = process.waitFor();
        } finally {
            Runtime.getRuntime().removeShutdownHook(cleanup);
        }
        System.out.println("Reports: " + project.resolve("artifacts"));
        System.exit(result);
    }

    private static String findNode() {
        String configured = System.getenv("NODE_BINARY");
        if (configured != null && !configured.isBlank()) return configured;
        Path bundled = Path.of(System.getProperty("user.home"), ".cache", "codex-runtimes",
                "codex-primary-runtime", "dependencies", "node", "bin", "node.exe");
        if (Files.isRegularFile(bundled)) return bundled.toString();
        String programFiles = System.getenv("ProgramFiles");
        if (programFiles != null) {
            Path installed = Path.of(programFiles, "nodejs", "node.exe");
            if (Files.isRegularFile(installed)) return installed.toString();
        }
        return "node";
    }
}
