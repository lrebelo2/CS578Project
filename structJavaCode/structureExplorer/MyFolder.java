package structureExplorer;

import java.io.File;
import java.util.ArrayList;

public class MyFolder {
	ArrayList<MyFolder> folders = new ArrayList<>();
	ArrayList<MyFile> files = new ArrayList<>();
	String name;
	int totalLoc = 0;
	File file;
	String path = "";
	public MyFolder(String name, File fileEntry) {
		this.name = name;
		file = fileEntry;
		path = fileEntry.getPath();
	}
	public void addFile(MyFile myFile) {
		files.add(myFile);
		totalLoc += myFile.loc;
	}
	public void addFolder(MyFolder myFolder) {
		folders.add(myFolder);
		totalLoc += myFolder.totalLoc;
	}

}
