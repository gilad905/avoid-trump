cd man
forfiles /c "magick convert @FILE -strokewidth 0 -fill white -draw ""rectangle 0,0 100,100 "" @FILE"