package util;

import java.util.List;
import java.util.Random;
import com.github.javafaker.Faker;
import io.github.cdimascio.dotenv.Dotenv;

public class CommonUtils {

  private CommonUtils(){

  }

  public static final Dotenv dotenv = Dotenv.load();
  public static final Faker faker = new Faker();
  static Random randomMethod = new Random();

  public static <T> T chooseOptionFromSequence(List<T> options,int index) {

    return options.get(index);
  }

  public static <T> T chooseRandomOptionFromSequence(List<T> options) {

    int optionsIndex = randomMethod.nextInt(options.size());
    return options.get(optionsIndex);
  }

  public static int generateRandomNumber(Integer range) {
    return randomMethod.nextInt(range);
  }
}
