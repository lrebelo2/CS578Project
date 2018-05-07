package structureExplorer;

import java.io.File;
import java.util.ArrayList;

public class MyFile {
	String name;
	int loc;
	File file;
	String objectName = "";
	ArrayList<String> dependents = new ArrayList<>();
	ArrayList<String> dependings =  new ArrayList<>();
	String path = "";
	
	public MyFile(String name, int loc, File fileEntry) {
		this.name = name;
		this.loc = loc;
		file = fileEntry;
		path = fileEntry.getPath();
		checkFileName();
	}
	private void checkFileName() {
		if(name.endsWith(".class")) {
			String path = file.getPath();
			String[] parts = path.split(File.separator);
			int ind = -1;
			
			for(int i=0; i < parts.length; i++) {
				if(ind > -1) {
					objectName += parts[i]+".";
				}
				if(parts[i].equals("classes")) {
					ind = i;	
				}
			}
			objectName = objectName.replace(".class.", "");
			System.out.println(objectName);
			
			
		}
		
	}
	
}
