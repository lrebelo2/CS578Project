package structureExplorer;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class FileExplorer {
	// a depends on b
	Map<String, ArrayList<String>> dependers = new HashMap<>(); // a to b
	Map<String, ArrayList<String>> dependees = new HashMap<>(); // b to a

	Map<String, ArrayList<String>> fileStructinDotFile = new HashMap<>();
	ArrayList<String> conditions = new ArrayList<>();

	public static void main(String[] args) throws IOException {

		FileExplorer fe = new FileExplorer();
		// arg[0] root folder or dot file
		// arg[1] deps
		// args[2] name
		// args[3] and others specific files

		File deps = new File(args[1]);
		fe.processDeps(deps);

		String fileName = args[2] + "_struct.json";
		if (args.length > 3) {
			for (int i = 3; i < args.length; i++) {
				System.out.println(args[i]);
				fe.conditions.add(args[i]);
			}
		}
		
		final File folder = new File(args[0]);
		MyFolder root = new MyFolder(folder.getName(), folder);
		fe.listFilesForFolder(folder, root);
		// fe.print(root);
		JSONObject obj = fe.createJSON(root);

		

		try (FileWriter file = new FileWriter(fileName)) {
			file.write(obj.toJSONString());
			System.out.println("Successfully Copied JSON Object to File...");
			System.out.println("\nJSON Object: " + obj);
		}
	}

	private void processDeps(File deps) {
		BufferedReader br;
		try {
			br = new BufferedReader(new FileReader(deps));

			String st;
			while ((st = br.readLine()) != null) {
				String[] parts = st.split(" ");
				addDependency(parts[2], parts[1], dependees);
				addDependency(parts[1], parts[2], dependers);

			}
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private void addDependency(String key, String val, Map<String, ArrayList<String>> map) {
		ArrayList<String> vals;
		if (map.containsKey(key)) {
			vals = map.get(key);

		} else {
			vals = new ArrayList<>();

		}
		vals.add(val);
		map.put(key, vals);

	}

	public JSONObject createJSON(MyFolder folder) {
		JSONObject obj = new JSONObject();
		obj.put("name", folder.name);
		obj.put("size", folder.totalLoc);
		obj.put("path", folder.path);
		JSONArray children = new JSONArray();
		for (MyFile file : folder.files) {
			JSONObject child = new JSONObject();
			child.put("name", file.name);
			child.put("size", file.loc);
			child.put("path", file.path);
			child.put("dependents", file.dependents.size());
			child.put("dependings", file.dependings.size());
			children.add(child);

		}
		for (MyFolder current : folder.folders) {
			children.add(createJSON(current));
		}
		obj.put("children", children);
		return obj;
	}

	public void listFilesForFolder(final File folder, MyFolder current) throws IOException {
		for (final File fileEntry : folder.listFiles()) {
			if (fileEntry.getName().equals(".DS_Store")) {
				continue;
			}
			if (fileEntry.isDirectory()) {
				MyFolder entry = new MyFolder(fileEntry.getName(), fileEntry);
				listFilesForFolder(fileEntry, entry);
				current.addFolder(entry);

			} else {
				// System.out.println(fileEntry.getName());
				if (checkFileType(fileEntry)) {
					MyFile tempFile = new MyFile(fileEntry.getName(), countLines(fileEntry.getPath()), fileEntry);
					current.addFile(tempFile);
					addDepsofFile(tempFile);
				}

			}
		}
	}

	private boolean checkFileType(File fileEntry) {
		
		if (conditions.isEmpty()) {
			return true;
		}
		for (String condition: conditions) {
			if (fileEntry.getName().endsWith(condition)) {
				return true;
			}
		}
		return false;
	}

	private void addDepsofFile(MyFile tempFile) {
		String objName = tempFile.objectName;
		if (objName.length() > 0) {
			System.out.println(dependers.get(objName));
			if (dependers.containsKey(objName)) {
				tempFile.dependents.addAll(dependers.get(objName));
			}
			if (dependees.containsKey(objName)) {
				tempFile.dependings.addAll(dependees.get(objName));
			}
		}

	}

	private void print(MyFolder root) {
		System.out.println("----------" + root.name + "---------");
		for (MyFolder mf : root.folders) {
			System.out.println("$D " + mf.name + " " + mf.totalLoc);
		}
		for (MyFile mf : root.files) {
			System.out.println("#F " + mf.name + " " + mf.loc);

		}
		for (MyFolder mf : root.folders) {
			print(mf);
		}

	}

	public int countLines(String filename) throws IOException {
		InputStream is = new BufferedInputStream(new FileInputStream(filename));
		try {
			byte[] c = new byte[1024];
			int count = 0;
			int readChars = 0;
			boolean empty = true;
			while ((readChars = is.read(c)) != -1) {
				empty = false;
				for (int i = 1; i < readChars; ++i) {
					if (c[i] == '\n') {
						if (c[i - 1] != c[i])
							++count;
					}
				}
			}
			return (count == 0 && !empty) ? 1 : count;
		} finally {
			is.close();
		}
	}

}
